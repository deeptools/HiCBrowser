import sys
import numpy as np
import json
from collections import OrderedDict

from bx.intervals.intersection import IntervalTree, Interval
import pygenometracks.readBed
from pygenometracks.tracks.GenomeTrack import GenomeTrack
from pygenometracks.utilities import file_to_intervaltree, opener


DEFAULT_TRACK_HEIGHT = 3  # in centimeters
DEFAULT_FIGURE_WIDTH = 40  # in centimeters
# proportion of width dedicated to (figure, legends)
DEFAULT_WIDTH_RATIOS = (0.95, 0.05)
DEFAULT_MARGINS = {'left': 0.04, 'right': 0.92, 'bottom': 0.12, 'top': 0.9}


class MultiDict(OrderedDict):
    """
    Class to allow identically named
    sections in configuration file
    by appending the section number as
    for example:
    1. section name
    """
    _unique = 0

    def __setitem__(self, key, val):
        if isinstance(val, OrderedDict):
            self._unique += 1
            key = "{}. [{}]".format(str(self._unique), key)
        OrderedDict.__setitem__(self, key, val)

class SetTracks(object):

    def __init__(self, tracks_file, fig_width=DEFAULT_FIGURE_WIDTH, fig_height=None):
        self.properties = {'general': {}}
        self.properties['general']['fig_width'] = fig_width
        self.properties['general']['fig_height'] = fig_height
        self.properties['tracks'] = []
        self.vlines_intval_tree = None
        self.parse_tracks(tracks_file)

        # initialize each track
        self.track_obj_list = []
        for idx, properties in enumerate(self.track_list):
            print(properties)
            if 'spacer' in properties:
                self.track_obj_list.append(PlotSpacer(properties))
                continue
            elif 'x-axis' in properties:
                self.track_obj_list.append(PlotXAxis(properties))
                continue
            if properties['file_type'] == 'bedgraph':
                self.track_obj_list.append(PlotBedGraph(properties))

            elif properties['file_type'] == 'bigwig':
                self.track_obj_list.append(PlotBigWig(properties))

            elif properties['file_type'] == 'bedgraph_matrix':
                self.track_obj_list.append(PlotBedGraphMatrix(properties))

            elif properties['file_type'] == 'hic_matrix':
                self.track_obj_list.append(PlotHiCMatrix(properties))

            elif properties['file_type'] == 'bed':
                self.track_obj_list.append(PlotBed(properties, fig_width))

            elif properties['file_type'] == 'links':
                self.track_obj_list.append(PlotArcs(properties))

            elif properties['file_type'] == 'boundaries':
                self.track_obj_list.append(PlotBoundaries(properties))

    def get_tracks_height(self, start, end):
        # prepare layout based on the tracks given.
        # The main purpose of the following loop is
        # to get the height of each of the tracks
        # because for the hi-C the height is variable with respect
        # to the range being plotted, the function is called
        # when each plot is going to be printed.
        track_height = []
        for track_dict in self.track_list:
            height = DEFAULT_TRACK_HEIGHT

            if 'width' in track_dict:
                height = track_dict['width']

            # compute the height of a Hi-C track
            # based on the depth such that the
            # resulting plot appears proportional
            #
            #      /|\
            #     / | \
            #    /  |d \   d is the depth that we want to be proportional
            #   /   |   \  when plotted in the figure
            # ------------------
            #   region len
            #
            # d (in cm) =  depth (in bp) * width (in cm) / region len (in bp)

            elif 'depth' in track_dict and track_dict['file_type'] == 'hic_matrix':
                # to compute the actual width of the figure the margins and the region
                # set for the legends have to be considered
                # DEFAULT_MARGINS[1] - DEFAULT_MARGINS[0] is the proportion of plotting area

                hic_width = self.fig_width * (DEFAULT_MARGINS['right'] - DEFAULT_MARGINS['left']) * DEFAULT_WIDTH_RATIOS[0]
                scale_factor = 0.5  # the scale factor is to obtain a 'pleasing' result.
                depth = min(track_dict['depth'],(end - start))

                height = scale_factor * depth * hic_width / (end - start)
            track_height.append(height)

        return track_height

    def get_json_interval_values(self, chrom, start, end):
        track_height = self.get_tracks_height(start, end)

        if not self.properties['general']['fig_height']:
            self.properties['general']['fig_height'] = sum(track_height)

        for idx, track in enumerate(self.track_obj_list):
            track.set_interval_values(chrom, start, end)
            self.properties['tracks'].append(track.properties)

        if self.vlines_intval_tree:
            self.set_interval_values_vlines(chrom, start, end)

        return json.dumps(self.properties)

    def set_interval_values_vlines(self, chrom_region, start_region, end_region):
        """
        Plots dotted lines from the top of the first plot to the bottom
        of the last plot at the specified positions.

        :param axis_list: list of plotted axis
        :return: None
        """
        vlines_list = []

        if chrom_region not in self.vlines_intval_tree.keys():
            chrom_region = GenomeTrack.change_chrom_names(chrom_region)
        for region in self.vlines_intval_tree[chrom_region].find(start_region - 10000,
                                                                 end_region + 10000):
            vlines_list.append(region.start)

        self.properties['general']['vertical_lines'] = vlines_list

    def parse_tracks(self, tracks_file):
        """
        Parses a configuration file

        :param tracks_file: file path containing the track configuration
        :return: array of dictionaries and vlines_file. One dictionary per track
        """
        from configparser import ConfigParser
        from ast import literal_eval
        parser = ConfigParser(None, MultiDict)
        parser.readfp(open(tracks_file, 'r'))

        track_list = []
        vlines_file = None
        for section_name in parser.sections():
            track_options = dict({"section_name": section_name})
            if section_name.endswith('[spacer]'):
                track_options['spacer'] = True
            elif section_name.endswith('[x-axis]'):
                track_options['x-axis'] = True
            for name, value in parser.items(section_name):
                if name in ['max_value', 'min_value', 'depth', 'width'] and value != 'auto':
                    track_options[name] = literal_eval(value)
                else:
                    track_options[name] = value

            if 'type' in track_options and track_options['type'] == 'vlines':
                vlines_file = track_options['file']
            else:
                track_list.append(track_options)

        for track_dict in track_list:
            warn = None
            if 'file' in track_dict and track_dict['file'] != '':
                self.check_file_exists(track_dict)
                if 'file_type' not in track_dict:
                    track_dict['file_type'] = self.guess_filetype(track_dict)

                #  set some default values
                if 'title' not in track_dict:
                    warn = "\ntitle not set for 'section {}'\n".format(track_dict['section_name'])
                    track_dict['title'] = ''
                if warn:
                    sys.stderr.write(warn)

        self.track_list = track_list
        if vlines_file:
            self.vlines_intval_tree, __, __ = file_to_intervaltree(vlines_file)

    def check_file_exists(self, track_dict):
        """
        Checks if a file or list of files exists
        :param track_dict: dictionary of track values. Should contain
                            a 'file' key containing the path of the file
                            or files to be checked separated by space
                            For example: file1 file2 file3
        :return: None
        """
        file_names = [x for x in track_dict['file'].split(" ") if x != '']
        for file_name in file_names:
            try:
                open(file_name, 'r').close()
            except IOError:
                sys.stderr.write("\n*ERROR*\nFile in section [{}] "
                                 "not found:\n{}\n\n".format(track_dict['section_name'],
                                                             file_name))
                sys.exit(1)

    @staticmethod
    def guess_filetype(track_dict):
        """

        :param track_dict: dictionary of track values with the 'file' key
                    containing a string path of the file or files. Only the ending
                     of the last file is used in case when there are more files
        :return: string file type detected
        """
        file = track_dict['file'].strip()
        file_type = None

        if file.endswith(".bed") or file.endswith(".bed.gz"):
            file_type = 'bed'
        elif file.endswith(".npz") or file.endswith(".h5"):
            file_type = 'hic_matrix'
        elif file.endswith(".bw"):
            file_type = 'bigwig'
        elif file.endswith(".bg") or file.endswith(".bg.gz"):
            file_type = 'bedgraph'
        elif file.endswith(".bm") or file.endswith(".bm.gz"):
            file_type = 'bedgraph_matrix'
        else:
            sys.exit("Section {}: can not identify file type. Please specify "
                     "the file_type for {}".format(track_dict['section_name'], file))
        return file_type


class TrackPlot(object):

    def __init__(self, properties_dict):
        self.properties = properties_dict


class PlotSpacer(TrackPlot):

    def set_interval_values(self, chrom_region, start_region, end_region):
        pass


class PlotBedGraph(TrackPlot):

    def __init__(self, properties_dict):
        self.properties = properties_dict
        self.interval_tree, ymin, ymax = file_to_intervaltree(self.properties['file'])

        if 'max_value' not in self.properties or self.properties['max_value'] == 'auto':
            self.properties['max_value'] = ymax

        if 'min_value' not in self.properties or self.properties['min_value'] == 'auto':
            self.properties['min_value'] = ymin

    def set_interval_values(self, chrom_region, start_region, end_region):
        score_list = []
        pos_list = []

        for region in self.interval_tree[chrom_region].find(start_region - 10000, end_region + 10000):
            score_list.append(float(region.value[0]))
            pos_list.append(region.start + (region.end - region.start)/2)

        self.properties['x_values'] = pos_list
        self.properties['y_values'] = score_list


class PlotBigWig(TrackPlot):

    def __init__(self, *args, **kwargs):
        super(self.__class__, self).__init__(*args, **kwargs)
        import pyBigWig
        self.bw = pyBigWig.open(self.properties['file'])

    def set_interval_values(self, chrom_region, start_region, end_region):
        num_bins = 700
        if 'number of bins' in self.properties:
            try:
                num_bins = int(self.properties['number of bins'])
            except TypeError:
                sys.exit("'number of bins' value: {} for bigwig file {} "
                     "is not valid.".format(self.properties['number of bins'],
                                            self.properties['file']))

        if chrom_region not in self.bw.chroms().keys():
            chrom_region = GenomeTrack.change_chrom_names(chrom_region)

        if chrom_region not in self.bw.chroms().keys():
            sys.exit("Can not read region {} from bigwig file:\n\n"
                 "{}\n\nPlease check that the chromosome name is part of the bigwig file "
                 "and that the region is valid".format(formated_region, self.properties['file']))

        if end_region - start_region < 2e6:
            scores = self.bw.values(chrom_region, start_region, end_region)

            if 'nans to zeros' in self.properties and self.properties['nans to zeros'] is True:
                scores[np.isnan(scores)] = 0

            scores = np.ma.masked_invalid(scores)

            lins = np.linspace(0, len(scores), num_bins).astype(int)
            scores_per_bin = [np.mean(scores[lins[x]:lins[x+1]]) for x in range(len(lins)-1)]
            _x = lins + start_region
            x_values = [float(_x[x] + _x[x+1])/2 for x in range(len(lins)-1)]
            self.properties['x_values'] = x_values
            self.properties['y_values'] = scores_per_bin
        else:
            # this method produces shifted regions. It is not clear to me why this happens.
            # Thus I only activate the faster but shifted method for large regions
            # when the previous method would be to slow
            scores = np.array(self.bw.stats(chrom_region, start_region, end_region, nBins=num_bins)).astype(float)
            x_values = np.linspace(start_region, end_region, num_bins)
            self.properties['x_values'] = x_values
            self.properties['y_values'] = scores


class PlotXAxis(TrackPlot):

    def __init__(self, *args, **kwargs):
        super(PlotXAxis, self).__init__(*args, **kwargs)
        if 'fontsize' not in self.properties:
            self.properties['fontsize'] = 15

    def set_interval_values(self, chrom_region, region_start, region_end):
        pass


class PlotBoundaries(TrackPlot):

    def __init__(self, *args, **kwargs):
        super(PlotBoundaries, self).__init__(*args, **kwargs)

        line_number = 0
        interval_tree = {}
        intervals = []
        prev_chrom = None
        valid_intervals = 0

        with open(self.properties['file'], 'r') as file_h:
            for line in file_h.readlines():
                line_number += 1
                if line.startswith('browser') or line.startswith('track') or line.startswith('#'):
                    continue
                try:
                    chrom, start, end = line.strip().split('\t')[0:3]
                except Exception as detail:
                    msg = 'Could not read line\n{}\n. {}'.format(line, detail)
                    sys.exit(msg)

                try:
                    start = int(start)
                    end = int(end)
                except ValueError as detail:
                    msg = "Error reading line: {}. One of the fields is not " \
                          "an integer.\nError message: {}".format(line_number, detail)
                    sys.exit(msg)

                assert start <= end, "Error in line #{}, end1 larger than start1 in {}".format(line_number, line)

                if prev_chrom and chrom != prev_chrom:
                    start_array, end_array = zip(*intervals)
                    start_array = np.array(start_array)
                    end_array = np.array(end_array)
                    # check if intervals are consecutive or 1bp positions demarcating the boundaries
                    if np.any(end_array - start_array == 1):
                        # The file contains only boundaries at 1bp position.
                        end_array = start_array[1:]
                        start_array = start_array[:-1]
                    interval_tree[prev_chrom] = IntervalTree()
                    for idx in range(len(start_array)):
                        interval_tree[prev_chrom].insert_interval(Interval(start_array[idx], end_array[idx]))
                        valid_intervals += 1
                    intervals = []

                intervals.append((start, end))

                # each interval spans from the smallest start to the largest end
                prev_chrom = chrom

        start, end = zip(*intervals)
        start = np.array(start)
        end = np.array(end)
        # check if intervals are consecutive or 1bp positions demarcating the boundaries
        if np.any(end - start == 1):
            # The file contains only boundaries at 1bp position.
            end = start[1:]
            start = start[:-1]
        interval_tree[chrom] = IntervalTree()
        for idx in range(len(start)):
            interval_tree[chrom].insert_interval(Interval(start[idx], end[idx]))
            valid_intervals += 1

        if valid_intervals == 0:
            sys.stderr.write("No valid intervals were found in file {}".format(self.properties['file']))

        file_h.close()
        self.interval_tree = interval_tree

    def set_interval_values(self, chrom_region, start_region, end_region):
        x = []
        y = []
        for region in self.interval_tree[chrom_region].find(start_region, end_region):
            """
                  /\
                 /  \
                /    \
            _____________________
               x1 x2 x3
            """
            x1 = region.start
            x2 = x1 + float(region.end - region.start) / 2
            x3 = region.end
            y1 = 0
            y2 = (region.end - region.start)
            x.extend([x1, x2, x3])
            y.extend([y1, y2, y1])

        self.properties['x_values'] = x
        self.properties['y_values'] = y


class PlotBed(TrackPlot):

    def __init__(self, properties, fig_width):
        super(PlotBed, self).__init__(properties)
        self.fig_width = fig_width

        from matplotlib import font_manager
        if 'fontsize' not in self.properties:
            self.properties['fontsize'] = 12
        else:
            self.properties['fontsize'] = float(self.properties['fontsize'])

        self.fp = font_manager.FontProperties(size=self.properties['fontsize'])

        if 'border_color' not in self.properties:
            self.properties['border_color'] = 'black'
        if 'labels' not in self.properties:
            self.properties['labels'] = 'on'
        if 'style' not in self.properties:
            self.properties['style'] = 'flybase'
        if 'display' not in self.properties:
            self.properties['display'] = 'stacked'

    def process_bed(self, region_start, region_end):

        # to improve the visualization of the genes
        # it is good to have an estimation of the label
        # length. In the following code I try to get
        # the length of a 'W'.
        if self.properties['labels'] == 'on':
            # from http://scipy-cookbook.readthedocs.org/items/Matplotlib_LaTeX_Examples.html
            inches_per_pt = 1.0 / 72.27
            font_in_inches = self.properties['fontsize'] * inches_per_pt
            region_len = region_end - region_start
            bp_per_inch = region_len / self.fig_width
            font_in_bp = font_in_inches * bp_per_inch
            self.len_w = font_in_bp
            print("len of w set to: {} bp".format(self.len_w))
        else:
            self.len_w = 1

        bed_file_h = hicexplorer.readBed.ReadBed(opener(self.properties['file']))
        self.bed_type = bed_file_h.file_type
        valid_intervals = 0
        self.max_num_row = {}
        self.interval_tree = {}
        prev = None
        # check for the number of other intervals that overlap
        #    with the given interval
        #            1         2
        #  012345678901234567890123456
        #  1=========       4=========
        #       2=========
        #         3============
        #
        # for 1 row_last_position = [9]
        # for 2 row_last_position = [9, 14]
        # for 3 row_last_position = [9, 14, 19]
        # for 4 row_last_position = [26, 14, 19]

        row_last_position = [] # each entry in this list contains the end position
                               # of genomic interval. The list index is the row
                               # in which the genomic interval was plotted.
                               # Any new genomic interval that wants to be plotted,
                               # knows the row to use by finding the list index that
                               # is larger than its start
        for bed in bed_file_h:
            if prev is not None:
                if prev.chromosome == bed.chromosome:
                    if bed.start < prev.start:
                        import ipdb;ipdb.set_trace()
                    assert bed.start >= prev.start, "*Error* Bed file not sorted. Please sort using sort -k1,1 -k2,2n"
                if prev.chromosome != bed.chromosome:
                    # init var
                    row_last_position = []
                    self.max_num_row[bed.chromosome] = 0
            else:
                self.max_num_row[bed.chromosome] = 0

            # check for overlapping genes including
            # label size (if plotted)

            if self.properties['labels'] == 'on' and bed.end - bed.start < len(bed.name) * self.len_w:
                bed_extended_end = int(bed.start + (len(bed.name) * self.len_w))
            else:
                bed_extended_end = (bed.end + 2 * self.small_relative)

            # get smallest free row
            if len(row_last_position) == 0:
                free_row = 0
                row_last_position.append(bed_extended_end)
            else:
                # get list of rows that are less than bed.start, then take the min
                idx_list = [idx for idx, value in enumerate(row_last_position) if value < bed.start]
                if len(idx_list):
                    free_row = min(idx_list)
                    row_last_position[free_row] = bed_extended_end
                else:
                    free_row = len(row_last_position)
                    row_last_position.append(bed_extended_end)

            if bed.chromosome not in self.interval_tree:
                self.interval_tree[bed.chromosome] = IntervalTree()

            self.interval_tree[bed.chromosome].insert_interval(Interval(bed.start, bed.end, value=(bed, free_row)))
            valid_intervals += 1
            prev = bed
            if free_row > self.max_num_row[bed.chromosome]:
                self.max_num_row[bed.chromosome] = free_row

        print(self.max_num_row)

        if valid_intervals == 0:
            sys.stderr.write("No valid intervals were found in file {}".format(self.properties['file_name']))

    def set_interval_values(self, chrom_region, start_region, end_region):
        self.small_relative = 0.002 * (end_region-start_region)
        self.process_bed(start_region, end_region)

        if chrom_region not in self.interval_tree.keys():
            chrom_region = GenomeTrack.change_chrom_names(chrom_region)

        genes_overlap = self.interval_tree[chrom_region].find(start_region, end_region)

        # turn labels off when too many intervals are visible.
        if self.properties['labels'] != 'off' and len(genes_overlap) > 60:
            self.properties['labels'] = 'off'

        interval_list = []
        for bed in genes_overlap:
            bed_data, row = bed.value
            interval_list.append({'bed': bed_data, 'row': row})

        self.properties['intervals'] = interval_list

