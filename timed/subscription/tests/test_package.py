from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_200_OK

from timed.projects.factories import ProjectFactory
from timed.subscription.factories import PackageFactory


def test_subscription_package_list(auth_client):
    PackageFactory.create()

    url = reverse('subscription-package-list')

    res = auth_client.get(url)
    assert res.status_code == HTTP_200_OK

    json = res.json()
    assert len(json['data']) == 1


def test_subscription_package_filter_customer(auth_client):
    other_project = ProjectFactory.create()
    PackageFactory.create(billing_type=other_project.billing_type)

    my_project = ProjectFactory.create()
    package = PackageFactory.create(billing_type=my_project.billing_type)

    url = reverse('subscription-package-list')

    res = auth_client.get(url, data={'customer': my_project.customer.id})
    assert res.status_code == HTTP_200_OK

    json = res.json()
    assert len(json['data']) == 1
    assert json['data'][0]['id'] == str(package.id)
