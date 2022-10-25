#!/bin/sh

GUNICORN_WORKERS="${GUNICORN_WORKERS:-8}"

poetry run python manage.py collectstatic --noinput

wait-for-it.sh "${DJANGO_DATABASE_HOST}":"${DJANGO_DATABASE_PORT}" -t "${WAITFORIT_TIMEOUT}" -- \
    poetry run python manage.py migrate --no-input && \
    poetry run gunicorn --workers=$GUNICORN_WORKERS --bind=0.0.0.0:80 timed.wsgi:application
