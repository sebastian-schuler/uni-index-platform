import { Text, Title } from '@mantine/core';
import { memo } from 'react';
import Faq from '../../components/elements/support/Faq';

const Support = () => {

  return (
    <div>
      <Title order={5}>Frequently asked questions</Title>
      <Text>Check if you can find a quicker answer to your question here before messaging us.</Text>
      <Faq />
    </div>
  )
}

export default memo(Support);