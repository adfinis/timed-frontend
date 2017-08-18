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
    install_requires=(
        'python-dateutil>=2.6,<2.7',
        'django>=1.11,<1.12',
        'django-auth-ldap==1.2.11',
        'django-filter==1.0.2',
        'django-multiselectfield==0.1.6',
        'djangorestframework>=3.6,<3.7',
        'djangorestframework-jsonapi==2.2.0',
        'djangorestframework-jwt==1.10.0',
        'psycopg2>=2.7,<2.8',
        'pytz==2017.2',
        'pyexcel-webio==0.1.2',
        'pyexcel-io==0.4.2',
        'django-excel==0.0.9',
        'pyexcel-ods3==0.4.0',
        'pyexcel-xlsx==0.4.1',
        'django-environ==0.4.3',
        'rest_condition==1.0.3',
    ),
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
