import { Notify } from 'quasar';

export function displayNotification(
  message: string,
  isError: boolean,
  iconName?: string,
  color?: string
) {
  Notify.create({
    type: color ? color : isError ? 'negative' : 'positive',
    message: message,
    icon: iconName ? iconName : isError ? 'report_problem' : 'info',
  });
}
