import sys
import numpy as np
from flask import Flask, render_template, request, send_file, Blueprint

import os
from os.path import exists

import json

import pygenometracks.plotTracks
from pygenometracks.tracks.GenomeTrack import GenomeTrack
import pygenometracks.tracksClass as pgttc
from pygenometracks.utilities import file_to_intervaltree, opener
import hicbrowser.utilities
import hicbrowser.tracks2json


from ConfigParser import SafeConfigParser

pgttc.DEFAULT_WIDTH_RATIOS = (0.01, 0.89, 0.11)
pgttc.DEFAULT_MARGINS = {'left': 0.02, 'right': 0.98, 'bottom': 0, 'top': 1}


def get_TAD_for_gene(gene_name):
    """
    Returs the TAD position of a given gene name

    :param gene_name:
    :return:
    """
    gene_name = gene_name.strip().lower()
    if gene_name in gene2pos:
        # get gene position
        chrom_, start_, end_ = gene2pos[gene_name]
        if chrom_ not in tads_intval_tree:
            chrom_ = GenomeTrack.change_chrom_names(chrom_)
        tad_pos = sorted(tads_intval_tree[chrom_].search(start_, end_))[0]
        return chrom_, tad_pos.begin, tad_pos.end
    else:
        return None


def snap_to_resolution(start, end):
    """
    given a start and end, guesses the resolution and
    snaps the start and end to the closes point
    :param start: int bp
    :param end:  int bp
    :return: start, end, resolution
    """

    assert end > start, "end smaller or equal to start"

    resolutions = np.array([10000, 50000, 100000, 500000, 1000000])

    # find the minimun absolute distance to 1/20 of the range (end-start) to
    # the resolution vector. argmin returns the index of the minimun value
    current_resolution = resolutions[np.abs(resolutions - (float(end - start) / 20)).argmin()]

    start -= start % current_resolution
    end -= (end % current_resolution)
    end += current_resolution
    # the number of 'current_resolution' bins between start and end has
    # to be divisible by three
    res = ((end - start) / current_resolution) % 3

    if res == 1:
        end += current_resolution
        start -= current_resolution
    elif res == 2:
        end += current_resolution

    return start, end, current_resolution


def check_static_img_folders():
    """
    check folders for gene and browser files in the current path
    The images and other files will be stored under images/genes and images/browser
    """
    dir_path = os.getcwd()
    # genes file is images/gene
    if not os.path.isdir(dir_path + '/images'):
        try:
            os.makedirs(dir_path + '/images')
        except:
            raise Exception("Images folder does not exists and can not be created.\n"
                            "Check that the user has permission to create the folder under\n"
                            "the current directory. The path for the folder is:\n"
                            "{}".format(dir_path + '/images/'))

    if not os.path.isdir(dir_path + '/images/genes'):
        os.makedirs(dir_path + '/images/genes')

    # path for browser images is images/browser
    if not os.path.isdir(dir_path + '/images/browser'):
        os.makedirs(dir_path + '/images/browser')

    return dir_path + '/images'


def main(config_file, port, numProc, template_folder=None,  debug=False):

    config = SafeConfigParser()
    config.readfp(open(config_file, 'r'))

    kwargs = {}
    if template_folder is not None:
        sys.stderr.write("setting template folder to\n {}\n".format(template_folder))
        kwargs['template_folder'] = template_folder

    app = Flask(__name__, **kwargs)

    img_path = check_static_img_folders()

    # register an static path for images using Blueprint
    images_static = Blueprint('site', __name__,
                              static_url_path='/images',
                              static_folder=img_path)
    app.register_blueprint(images_static)

    # setup up the tracks. It works as follows
    # the config.ini file is read and split into individual tracks
    # that are saved on a temporary file.
    # then, pygenometracks.tracksClass.PlotTracks object is initialized with this track and
    # store on a list (trp_list). If the tracks were not to be splited in
    # individual files, plotTracks will plot everything togeher. By splitting
    # them we take advantage of multiprocessing to generate each image on
    # a different core. Naturally, if using only one core then nothing is gained.
    track_file = config.get("browser", "tracks")
    trp_list = []
    for track in track_file.split(" "):
        trp_list.append(pgttc.PlotTracks(track))


    tad_img_root = img_path + '/genes'
    img_root = img_path + '/browser'

    # initialize TAD interval tree
    # using the 'TAD intervals' file in the config file

    tads_file = config.get('general', 'TAD intervals')
    global tads_intval_tree
    tads_intval_tree, __, __ = file_to_intervaltree(tads_file)

    # initialize gene name to position mapping
    genes = config.get('general', 'genes')

    global gene2pos
    gene2pos = {}

    # initialize tads tracks
    track_file = config.get('general', 'tracks')
    tads = hicbrowser.tracks2json.SetTracks(track_file, fig_width=40)

    with opener(genes) as fh:
        for line in fh.readlines():
            if line.startswith('browser') or line.startswith('track') or line.startswith('#'):
                continue
            gene_chrom, gene_start, gene_end, gene_name = line.strip().split("\t")[0:4]
            try:
                gene_start = int(gene_start)
                gene_end = int(gene_end)
            except ValueError:
                sys.stderr.write("Problem with line {}".format(line))
                pass
            gene2pos[gene_name.lower()] = (gene_chrom, gene_start, gene_end)

    @app.route('/', methods=['GET'])
    def index():
        return render_template("index.html")

    @app.route('/gene/<gene_name>', methods=['GET'])
    def get_tad(gene_name):
        res = "unknown gene"
        if gene_name:
            # see if the gene is known
            tad_pos = get_TAD_for_gene(gene_name)
            if tad_pos:
                chromosome, start, end = tad_pos
                start -= 50000
                end += 50000

                # plot
                outfile = "{}/{}_{}_{}.json".format(tad_img_root,
                                                    chromosome,
                                                    start,
                                                    end)
                if not exists(outfile):
                    with open(outfile, 'w') as fh:
                        sys.stderr.write("Saving json file: {}\n".format(outfile))
                        fh.write(tads.get_json_interval_values(chromosome, start, end))

                data = {'name': gene_name,
                        'img': outfile,
                        'chromosome': chromosome,
                        'start': start,
                        'end': end}

                with open(outfile) as tracks:
                        d = json.load(tracks)

                data['tracks'] = d
                res = json.dumps(data)

        return res

    @app.route('/browser/<query>', methods=['GET'])
    def browser(query):
        if query:
            gene_name = query.strip().lower()
            # check if the query is a valid gene name
            if gene_name in gene2pos:
                chromosome, start, end = gene2pos[gene_name]
                start -= 50000
                end += 50000
            else:
                chromosome, start, end = pygenometracks.plotTracks.get_region(query.strip())
                if end - start < 10000:
                    sys.stderr.write("region to small ({}bp), enlarging it.".format(end - start))
                    start -= 5000
                    end += 5000

            start, end, resolution = snap_to_resolution(start, end)
            ### split tracks
            # split the interval into three parts
            tracks = []
            content = []
            """
            # this commented code, splits each track into 'split_number' tiles that could be quicker to
            # generate. For this to take effect the varibles at the top of this file had to be set
            # as follows:

            # hicexplorer.trackPlot.DEFAULT_WIDTH_RATIOS = (1, 0)
            # hicexplorer.trackPlot.DEFAULT_MARGINS = {'left': 0, 'right': 1, 'bottom': 0, 'top': 1}

            # the downside of this approach is that the track labels are missing.
            split_number = 3
            split_range_length = (end - start) / split_number
            ranges = [(start + x * split_range_length, start + (x + 1) * split_range_length) for x in range(split_number)]
            for _range in ranges:
                img_code = []
                img_content = []
                for trp_idx in range(len(trp_list)):
                    figure_path = "/get_image?region={}:{}-{}&id={}".format(chromosome, _range[0], _range[1], trp_idx)
                    img_code.append(figure_path)

                    figure_content_path = "/get_image?region={}:|+start+|-|+end+|&id={}".format(chromosome, trp_idx)
                    img_content.append(figure_content_path)

                tracks.append(img_code)
                if len(content) == 0:
                    content.append(" ".join(img_content))
            ###
            """
            img_code = []
            img_content = []
            for trp_idx in range(len(trp_list)):
                figure_path = "/get_image?region={}:{}-{}&id={}".format(chromosome, start, end, trp_idx)
                img_code.append(figure_path)

                figure_content_path = "/get_image?region={}:|+start+|-|+end+|&id={}".format(chromosome, trp_idx)
                img_content.append(figure_content_path)

            tracks.append(img_code)
            if len(content) == 0:
                content.append(" ".join(img_content))

            content = " ".join(content)
            content = content.replace('"', '\\"')
            content = content.replace('|', '"')
            view_range = end - start
            prev_query_str = "{}:{}-{}".format(chromosome, start - view_range, end - view_range)
            next_query_str = "{}:{}-{}".format(chromosome, start + view_range, end + view_range)
            half_rage = view_range / 2
            center = start + half_rage
            zoom_out = "{}:{}-{}".format(chromosome, center - half_rage * 3, center + half_rage * 3)
            step = start - end
        else:
            chromosome = ''
            start = ''
            end = ''
            figure_path = '/static/img/region_ctcf_30_50.png'

        if chromosome:
            region = "{}:{}-{}".format(chromosome, start, end)
        else:
            region = ''
            prev_query_str = None
            next_query_str = None
            zoom_out = None
            content = None
            tracks = figure_path
            step = None
            start = start
            end = end

        data = {'region': region,
                'tracks': tracks,
                'next': next_query_str,
                'previous': prev_query_str,
                'out': zoom_out,
                'step': step,
                'content': content,
                'start': start,
                'end': end}
        json_data = json.dumps(data)

        return json_data

    @app.route('/get_image', methods=['GET'])
    def get_image():
        query = request.args.get('region', None)
        img_id = request.args.get('id', None)
        try:
            img_id = int(img_id)
        except ValueError:
            sys.stderr.write('track id not a number')
            return None
        if query:
            query = query.strip()
            chromosome, start, end = pygenometracks.plotTracks.get_region(query)

            outfile = "{}/{}_{}_{}_{}.png".format(img_root,
                                                  chromosome,
                                                  start,
                                                  end,
                                                  img_id)
            # if the figure does no exists, then
            # hicexplorer.trackPlot is called (trp_list[img_id] contains
            # an instance of pygenometracks.tracksClass.PlotTracks)
            if not exists(outfile):
                trp_list[img_id].plot(outfile, chromosome, start, end)

            return send_file(outfile, mimetype='image/png')

        return None

    # run the app
    app.run(host='0.0.0.0', debug=debug, use_reloader=False, port=port, processes=numProc)
