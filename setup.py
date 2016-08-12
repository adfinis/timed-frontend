"""Setuptools package definition"""

from setuptools import setup
import codecs

with codecs.open("README.md", "r", encoding="UTF-8") as f:
    README_TEXT = f.read()

setup(
    name = "timed",
    version = "0.0.0",
    entry_points = {
        "console_scripts": [
        ]
    },
    install_requires = [
        "django==1.9",
        "django-auth-ldap==1.2.8",
        "djangorestframework==3.4.1",
        "djangorestframework-jsonapi==2.0.1",
        "djangorestframework-jwt==1.8.0",
        "django-filter==0.13",
        "django-crispy-forms==1.6.0",
        "flake8",
        "coverage",
        "pytest",
        "pytest-django",
        "pytest-cov",
        "factory-boy==2.7.0",
        "psycopg2",
        "ipdb"
    ],
    author = "Adfinis SyGroup AG",
    author_email = "https://adfinis-sygroup.ch/",
    description = "Timetracking software",
    long_description = README_TEXT,
    keywords = "timetracking",
    url = "https://adfinis-sygroup.ch/",
    classifiers = [
        "Development Status :: 4 - Beta",
        "Environment :: Console",
        "Intended Audience :: Developers",
        "Intended Audience :: Information Technology",
        "License :: OSI Approved :: "
        "GNU Affero General Public License v3",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.5.1",
    ]
)
