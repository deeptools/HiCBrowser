#-*- coding: utf-8 -*-

import os
import sys
import subprocess
import re

from setuptools import setup
from setuptools.command.sdist import sdist as _sdist
from setuptools.command.install import install as _install

VERSION_PY = """
# This file is originally generated from Git information by running 'setup.py
# version'. Distribution tarballs contain a pre-generated copy of this file.

__version__ = '%s'
"""


def update_version_py():
    if not os.path.isdir(".git"):
        print "This does not appear to be a Git repository."
        return
    try:
        p = subprocess.Popen(["git", "describe",
                              "--tags", "--always"],
                             stdout=subprocess.PIPE)
    except EnvironmentError:
        print "unable to run git, leaving hicexplorer/_version.py alone"
        return
    stdout = p.communicate()[0]
    if p.returncode != 0:
        print "unable to run git, leaving hicexplorer/_version.py alone"
        return
    ver = stdout.strip()
    f = open("hicexplorer/_version.py", "w")
    f.write(VERSION_PY % ver)
    f.close()
    print "set hicexplorer/_version.py to '%s'" % ver


def get_version():
    try:
        f = open("hicexplorer/_version.py")
    except EnvironmentError:
        return None
    for line in f.readlines():
        mo = re.match("__version__ = '([^']+)'", line)
        if mo:
            ver = mo.group(1)
            return ver
    return None


class sdist(_sdist):
    def run(self):
        update_version_py()
        self.distribution.metadata.version = get_version()
        return _sdist.run(self)


setup(
    name='HiCBrowser',
    version=get_version(),
    author='Fidel Ramirez',
    author_email='ramirez@ie-freiburg.mpg.de',
    packages=['hicbrowser'],
    scripts=['bin/runserver.py'],
    include_package_data=True,
    license='LICENSE',
    description='Simple web browser to visualize Hi-C and other genomid data.',
    #long_description=open('README.rst').read(),
    install_requires=[
        "Flask==0.10.1",
        "HiCExplorer"
    ],
    cmdclass={'sdist': sdist}
)
