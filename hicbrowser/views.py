from hicbrowser import app
from flask import render_template, request, send_file

from os.path import basename, exists

import hicexplorer.hicPlotTADs

img_root = "/data/manke/group/ramirez/tools/HiCBrowser/HiCBrowser/static/tmp"
@app.route('/', methods=['GET'])
def index():
    try:
        #import ipdb;ipdb.set_trace()

        chromosome = request.args['chromosome'].strip()
        start = int(request.args['start'].strip())
        end = int(request.args['end'].strip())

        outfile = "{}/{}_{}_{}.png".format(img_root,
                                           chromosome,
                                           start,
                                           end)
        if not exists(outfile):
            cmd_args = "--tracks /data/manke/group/ramirez/tools/HiCBrowser/tracks.ini " \
                       "--region {}:{}-{} -o {}".format(chromosome, start, end, outfile)

            print cmd_args
            hicexplorer.hicPlotTADs.main(args=cmd_args.split(" "))

        figure_path = "/static/tmp/{}".format(basename(outfile))
        print figure_path
    except Exception as e:
        print e.message, e.args
        chromosome = ''
        start = ''
        end = ''
        figure_path = '/static/img/region_ctcf_30_50.png'

    return render_template("layout.html", chromosome=chromosome,
                           start=start, end=end, figure_path=figure_path)



@app.route('/get_image', methods=['GET'])
def get_image():
    chromosome = request.args['chromosome'].strip()
    start = int(request.args['start'].strip())
    end = int(request.args['end'].strip())

    outfile = "{}/{}_{}_{}.png".format(img_root,
                                       chromosome,
                                       start,
                                       end)
    if not exists(outfile):
        cmd_args = "--tracks /data/manke/group/ramirez/tools/HiCBrowser/tracks.ini " \
                   "--region {}:{}-{} -o {}".format(chromosome, start, end, outfile)

        print cmd_args
        hicexplorer.hicPlotTADs.main(args=cmd_args.split(" "))

    return send_file(outfile, mimetype='image/png')

