import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django.utils import timezone
from django_apscheduler.jobstores import DjangoJobStore

from notifications.models import Notification
from reservations.models import Reservation, Status
from restify import settings


def check_for_upcoming_reservations():
    reservations_to_notify = Reservation.objects.filter(status__iexact=Status.APPROVED, start_date=(timezone.now().date() + datetime.timedelta(days=1)))
    for reservation in reservations_to_notify:
        Notification.objects.create(content="guest_upcoming_reservation", receiver=reservation.reserver)
        print("Notification sent")


def check_for_expired_reservations():
    print("Checking for expired reservations...")
    reservations_that_could_expire = Reservation.objects.filter(status__iexact="pending").exclude(
        seconds_before_expiry=None)
    for reservation in reservations_that_could_expire:
        if timezone.now() >= reservation.creation_date + datetime.timedelta(seconds=reservation.seconds_before_expiry):
            reservation.status = Status.EXPIRED
            reservation.save()
            print(f"Reservation {reservation.pk} is now expired.")


def run():
    scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE, daemon=True)

    scheduler.add_jobstore(DjangoJobStore(), "default")

    scheduler.add_job(
        check_for_expired_reservations,
        trigger=CronTrigger(second="*/8"),  # Every 8 seconds
        id="check_for_expired_reservations",
        max_instances=1,
        replace_existing=True,
    )

    scheduler.add_job(
        check_for_upcoming_reservations,
        trigger=CronTrigger(second="*/30"),
        id="check_for_upcoming_reservations",
        max_instances=1,
        replace_existing=True,
    )

    try:
        print("Starting scheduler...")
        scheduler.start()
    except KeyboardInterrupt:
        print("Stopping scheduler...")
        scheduler.shutdown()
        print("Scheduler shut down successfully!")
