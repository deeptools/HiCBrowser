
import sys
import argparse
from hicbrowser import views
#from hicbrowser._version import __version__

def parse_arguments(args=None):

    parser = argparse.ArgumentParser(
        description='Activate HiCBrowser using a given cofiguration file.')

    # define the arguments
    parser.add_argument('--config', '-c',
                        help='Configuration file with genomic tracks.',
                        required=True)

    parser.add_argument('--port', '-p' ,
                        help='Local browser port to use.',
                        default=8000)

    parser.add_argument('--numProcessors', '-np' ,
                        help='Number of processors to use.',
                        default=20)

    parser.add_argument('--version', action='version',
                        version='%(prog)s {}'.format(__version__))

    return parser

def main():
    args = parse_arguments().parse_args()
    views.configFile = args.config
    views.app.run(host='0.0.0.0', debug=True,use_reloader=False, port=args.port, processes=args.numProcessors)
