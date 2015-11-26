import sys
from hicbrowser import app
from flask import render_template, request, send_file

from os.path import basename, exists

import hicexplorer.trackPlot

#track_file = "/data/manke/group/ramirez/tools/HiCBrowser/tracks.ini"
track_file = sys.argv[1]
print track_file

trp = hicexplorer.trackPlot.PlotTracks(track_file, fig_width=60, dpi=70)

#img_root = "/data/manke/group/ramirez/tools/HiCBrowser/hicbrowser/static/tmp"

img_root = sys.argv[2]


def get_region(region_string):
    """
    splits a region string into
    a chrom, start_region, end_region tuple
    The region_string format is chr:start-end
    """
    if region_string:
        for char in ",.;|!{}()":
            region_string = region_string.replace(char, '')
        for char in "-\t ":
            region_string = region_string.replace(char, ':')
        region = region_string.split(":")
        chrom = region[0]
        try:
            region_start = int(region[1])
        except IndexError:
            region_start = 0
        try:
            region_end = int(region[2])
        except IndexError:
            region_end = 1e15  # a huge number

        if region_end <= region_start:
            exit("Please check that the region end is larger than the region start.\n"
                 "Values given:\nstart: {}\nend: {}\n".format(region_start, region_end))

        return chrom, region_start, region_end

@app.route('/', methods=['GET'])
def index():
    try:
        #import ipdb;ipdb.set_trace()
        print request.args['region'].strip()
        chromosome, start, end = get_region(request.args['region'].strip())
        if end - start < 100000:
            sys.stderr.write("region to small ({}bp), enlarging it.".format(end-start))
            start -= 50000
            end += 50000
        outfile = "{}/{}_{}_{}.png".format(img_root,
                                           chromosome,
                                           start,
                                           end)
        if not exists(outfile):
            trp.plot(outfile, chromosome, start, end, title="{}:{}-{}".format(chromosome, start, end))

        figure_path = "/get_image?region={}:{}-{}".format(chromosome, start, end)
        print figure_path
    except Exception as e:
        print e.message, e.args
        chromosome = ''
        start = ''
        end = ''
        figure_path = '/static/img/region_ctcf_30_50.png'

    if chromosome:
        region = "{}:{}-{}".format(chromosome, start, end)
    else:
        region = ''
    return render_template("layout.html", region=region, figure_path=figure_path)



@app.route('/get_image', methods=['GET'])
def get_image():
    chromosome, start, end = get_region(request.args['region'].strip())

    outfile = "{}/{}_{}_{}.png".format(img_root,
                                       chromosome,
                                       start,
                                       end)
    if not exists(outfile):
        trp.plot(outfile, chromosome, start, end)

    return send_file(outfile, mimetype='image/png')

