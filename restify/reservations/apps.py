import sys

from django.apps import AppConfig


class ReservationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reservations'

    def ready(self):
        if 'runserver' not in sys.argv:
            return True

        # You must import your modules here
        # to avoid AppRegistryNotReady exception

        # startup code here
        from reservations.cron_routines import run

        run()
