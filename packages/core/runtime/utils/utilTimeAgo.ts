import {useTimeAgo, type UseTimeAgoMessages, type UseTimeAgoUnitNamesDefault} from "@vueuse/core";
import {useI18n} from "vue-i18n";

export function formatLocaleTimeAgo(date:Date) {
    const { t } = useI18n();

    const I18N_MESSAGES: UseTimeAgoMessages<UseTimeAgoUnitNamesDefault> = {
        justNow: t('gridsky.timeAgo.just-now'),
        past: (n) => (n.match(/\d/) ? t('gridsky.timeAgo.ago', [n]) : n),
        future: (n) => (n.match(/\d/) ? t('gridsky.timeAgo.in', [n]) : n),
        month: (n, past) =>
            n === 1
                ? past
                    ? t('gridsky.timeAgo.last-month')
                    : t('gridsky.timeAgo.next-month')
                : `${n} ${t(`gridsky.timeAgo.month`, n)}`,
        year: (n, past) =>
            n === 1
                ? past
                    ? t('gridsky.timeAgo.last-year')
                    : t('gridsky.timeAgo.next-year')
                : `${n} ${t(`gridsky.timeAgo.year`, n)}`,
        day: (n, past) =>
            n === 1
                ? past
                    ? t('gridsky.timeAgo.yesterday')
                    : t('gridsky.timeAgo.tomorrow')
                : `${n} ${t(`gridsky.timeAgo.day`, n)}`,
        week: (n, past) =>
            n === 1
                ? past
                    ? t('gridsky.timeAgo.last-week')
                    : t('gridsky.timeAgo.next-week')
                : `${n} ${t(`gridsky.timeAgo.week`, n)}`,
        hour: (n) => `${n} ${t('gridsky.timeAgo.hour', n)}`,
        minute: (n) => `${n} ${t('gridsky.timeAgo.minute', n)}`,
        second: (n) => `${n} ${t(`gridsky.timeAgo.second`, n)}`,
        invalid: '',
    };

    return useTimeAgo(date, {
        fullDateFormatter: (date: Date) => date.toLocaleDateString(),
        messages: I18N_MESSAGES,
    }).value;
}
