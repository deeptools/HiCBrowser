from ConfigParser import SafeConfigParser
import tempfile
from collections import OrderedDict
import re


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


def parse_tracks(tracks_file):
    """
    Parses a configuration file and writes each section into its own
    file.

    :param tracks_file: file path containing the track configuration
    :return: list of temporary file names containing each of the sections
    """

    parser = SafeConfigParser(None, MultiDict)
    parser.readfp(open(tracks_file, 'r'))
    p = re.compile('\[.+\]')

    vlines = None
    # check for vlines:
    for section_name in parser.sections():
        for name, value in parser.items(section_name):
            if name == 'type' and value == 'vlines':
                # build vlines section
                vlines = "[vlines]\n"
                for name, value in parser.items(section_name):
                    vlines += "{}={}\n".format(name, value)
                parser.remove_section(section_name)

    tracks_names = []
    for section_name in parser.sections():
        _temp = tempfile.NamedTemporaryFile(delete=False, prefix='conf_', suffix=".ini")
        s_name = p.findall(section_name)[0]
        _temp.write("{}\n".format(s_name))
        for name, value in parser.items(section_name):
            _temp.write("{}={}\n".format(name, value))

        if vlines:
            _temp.write("\n")
            _temp.write(vlines)
        tracks_names.append((_temp.name, section_name))
        _temp.close()

    return tracks_names
