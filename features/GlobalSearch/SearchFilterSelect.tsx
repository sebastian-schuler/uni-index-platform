import { MultiSelect } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'

export type FilterDataItem = { label: string, value: string }

type Props = {
  value: string[]
  onChange: (value: string[]) => void
}

const SearchFilterSelect = ({ value, onChange }: Props) => {

  const { t } = useTranslation('search');

  const data: FilterDataItem[] = [
    { label: t('filter.item-labels.institution'), value: 'institution' },
    { label: t('filter.item-labels.subject'), value: 'subject' },
    { label: t('filter.item-labels.country'), value: 'country' },
    { label: t('filter.item-labels.state'), value: 'state' },
    { label: t('filter.item-labels.city'), value: 'city' },
  ]

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      size={'md'}
      data={data}
      label={t('filter.label')}
      placeholder={t('filter.placeholder')}
      sx={{ flex: 1 }}
      clearable
    />
  )
}

export default SearchFilterSelect