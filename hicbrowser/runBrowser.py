
import sys
import argparse
from hicbrowser import views
from hicbrowser._version import __version__

def parse_arguments(args=None):

    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        description='Activate HiCBrowser using a given configuration file.')

    # define the arguments
    parser.add_argument('--config', '-c',
                        help='Configuration file with genomic tracks.',
                        required=True)

    parser.add_argument('--port', '-p',
                        help='Local browser port to use.',
                        type=int,
                        default=8000)

    parser.add_argument('--htmlFolder',
                        help='In case you want to personalize the content of the landing page, '
                        'provide the full path of the folder where the template index.html file is located.',
                        default=None)

    parser.add_argument('--numProcessors', '-np',
                        help='Number of processors to use.',
                        type=int,
                        default=1)

    parser.add_argument('--debug',
                        help='Set to run the server in debug mode which will '
                             'print useful information.',
                        action='store_true')

    parser.add_argument('--version', action='version',
                        version='%(prog)s {}'.format(__version__))

    return parser


def main():
    args = parse_arguments().parse_args()
    views.main(config_file=args.config, port=args.port, numProc=args.numProcessors,
               template_folder=args.htmlFolder, debug=args.debug)
