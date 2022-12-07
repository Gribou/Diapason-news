from django.utils.log import AdminEmailHandler
from django.core.mail.message import EmailMultiAlternatives
from constance import config


def mail_admins(subject,
                message,
                html_message=None,
                fail_silently=True,
                from_email=None,
                *args,
                **kwargs):
    if not config.EMAIL_ADMIN:
        return
    subject = '%s%s' % (config.EMAIL_SUBJECT_PREFIX, subject)
    from_email = from_email if from_email else config.EMAIL_ADMIN
    to = [config.EMAIL_ADMIN]
    mail = EmailMultiAlternatives(subject, message, from_email, to, *args,
                                  **kwargs)
    if html_message:
        mail.attach_alternative(html_message, 'text/html')
    mail.send(fail_silently=fail_silently)


class ConstanceAdminEmailHandler(AdminEmailHandler):
    '''usesdynamic constance settings instead of core django settings'''

    def send_mail(self,
                  subject,
                  message,
                  html_message=None,
                  fail_silently=False,
                  *args,
                  **kwargs):
        mail_admins(subject,
                    message,
                    html_message=html_message,
                    fail_silently=fail_silently,
                    connection=self.connection())
