import sys
from hicbrowser import app
from flask import render_template, request, send_file

from os.path import basename, exists

import hicexplorer.trackPlot

from ConfigParser import SafeConfigParser
config = SafeConfigParser()
config.readfp(open(sys.argv[1], 'r'))

track_file = config.get("browser", "tracks")
print track_file
trp = hicexplorer.trackPlot.PlotTracks(track_file, fig_width=60, dpi=70)

img_root = config.get('browser', 'images folder')

# initialize TAD interval tree
tads_file = config.get('general', 'TAD intervals')
global tads_intval_tree
tads_intval_tree = hicexplorer.trackPlot.file_to_intervaltree(tads_file)

# initialize gene name to position mapping
genes = config.get('general', 'genes')

global gene2pos
gene2pos = {}

# initialize tads tracks
track_file = config.get('general', 'tracks')
tads = hicexplorer.trackPlot.PlotTracks(track_file, fig_width=60, dpi=70)

tad_img_root = config.get('general', 'images folder')


with open(genes, 'r') as fh:
    for line in fh.readlines():
        if line.startswith('browser') or line.startswith('track') or line.startswith('#'):
            continue
        chrom, start, end, name = line.strip().split("\t")[0:4]
        try:
            start = int(start)
            end = int(end)
        except ValueError:
            sys.stderr.write("Problem with line {}".format(line))
            pass
        gene2pos[name.lower()] = (chrom, start, end)

def get_TAD_for_gene(gene_name):
    """
    Returs the TAD position of a given gene name

    :param gene_name:
    :return:
    """
    if gene_name in gene2pos:
        gene_name = gene_name.strip().lower()
        # get gene position
        chrom, start, end = gene2pos[gene_name]
        tad_pos = tads_intval_tree[chrom].find(start, end)[0]

        return chrom, tad_pos.start, tad_pos.end
    else:
        return None

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
    gene_name = request.args.get('search', None)
    if gene_name:
        # see if the gene is known
        tad_pos = get_TAD_for_gene(gene_name)
        if tad_pos:
            chromosome, start, end = tad_pos
            start -= 50000
            end += 50000
            # plot
            outfile = "{}/{}_{}_{}.png".format(tad_img_root,
                                               chromosome,
                                               start,
                                               end)
            if not exists(outfile):
                tads.plot(outfile, chromosome, start, end)

            return send_file(outfile, mimetype='image/png')

    return render_template("index.html")

@app.route('/browser', methods=['GET'])
def browser():
    try:
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

