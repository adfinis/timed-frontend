import datetime

from dateutil import parser
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.template.loader import get_template, render_to_string


def prepare_and_send_email(project, order_duration):
    template_txt = get_template("notify_accountants_order.txt")
    from_email = settings.DEFAULT_FROM_EMAIL
    connection = get_connection()
    messages = []

    customer = project.customer

    duration = parser.parse(order_duration)
    hours_added = datetime.timedelta(
        days=duration.day,
        hours=duration.hour,
        minutes=duration.minute,
        seconds=duration.second,
    )
    hours_total = hours_added + project.estimated_time

    subject = f"Customer Center Credits/Reports: {customer.name} has ordered {hours_added} hours."

    body_txt = template_txt.render(
        {
            "customer": customer,
            "project": project,
            "hours_added": hours_added,
            "hours_total": hours_total,
        }
    )
    body_html = render_to_string(
        "notify_accountants_order.html",
        {
            "customer": customer,
            "project": project,
            "hours_added": hours_added,
            "hours_total": hours_total,
        },
    )

    message = EmailMultiAlternatives(
        subject=subject,
        body=body_txt,
        from_email=from_email,
        to=[settings.CUSTOMER_CENTER_EMAIL],
        connection=connection,
        headers=settings.EMAIL_EXTRA_HEADERS,
    )
    message.attach_alternative(body_html, "text/html")

    messages.append(message)
    connection.send_messages(messages)
