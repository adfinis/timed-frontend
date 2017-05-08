"""Setuptools package definition."""

import codecs

from setuptools import find_packages, setup

from timed import __version__

with codecs.open('README.md', 'r', encoding='UTF-8') as f:
    README_TEXT = f.read()

setup(
    name='timed',
    version=__version__,
    author='Adfinis SyGroup AG',
    author_email='https://adfinis-sygroup.ch/',
    description='Timetracking software',
    long_description=README_TEXT,
    keywords='timetracking',
    url='https://adfinis-sygroup.ch/',
    packages=find_packages(),
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'Intended Audience :: Information Technology',
        'License :: OSI Approved :: '
        'GNU Affero General Public License v3',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.5',
    ]
)
