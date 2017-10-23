"""Setuptools package definition."""

import codecs
import os
from collections import defaultdict

from setuptools import find_packages, setup

from timed import __version__

with codecs.open('README.md', 'r', encoding='UTF-8') as f:
    README_TEXT = f.read()


def find_data(packages, extensions):
    """Find data files along with source.

    :param   packages: Look in these packages
    :param extensions: Look for these extensions
    """
    data = defaultdict(list)
    for package in packages:
        package_path = package.replace('.', '/')
        for dirpath, _, filenames in os.walk(package_path):
            for filename in filenames:
                for extension in extensions:
                    if filename.endswith('.%s' % extension):
                        file_path = os.path.join(
                            dirpath,
                            filename
                        )
                        file_path = file_path[len(package) + 1:]
                        data[package].append(file_path)
    return data


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
        'djangorestframework-jsonapi==2.2.0adsy1',
        'djangorestframework-jwt==1.10.0',
        'psycopg2>=2.7,<2.8',
        'pytz==2017.2',
        'pyexcel-webio==0.1.2',
        'pyexcel-io==0.5.1',
        'django-excel==0.0.9',
        'pyexcel-ods3==0.5.0',
        'pyexcel-xlsx==0.5.0.1',
        'pyexcel-ezodf==0.3.3',
        'django-environ==0.4.3',
        'rest_condition==1.0.3',
        'django-money==0.11.4',
        'python-redmine==2.0.2',
    ),
    dependency_links=(
        # TODO: when following PR are released, change back to official release
        # https://github.com/django-json-api/django-rest-framework-json-api/pull/376
        # https://github.com/django-json-api/django-rest-framework-json-api/pull/374
        'https://github.com/adfinis-forks/django-rest-framework-json-api/tarball/timed_master#egg=djangorestframework-jsonapi-2.2.0adsy1',  # noqa: E501
    ),
    keywords='timetracking',
    url='https://adfinis-sygroup.ch/',
    packages=find_packages(),
    package_data=find_data(
        find_packages(), ['txt']
    ),
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
