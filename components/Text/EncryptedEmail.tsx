import { Anchor, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import React, { useState } from 'react'

interface Props {
  email: string
}

const EncryptedEmail = ({ email }: Props) => {

  const [isVisible, setIsVisible] = useState(false);
  const theme = useMantineTheme();

  const atIndex = email.indexOf('@');
  let encryptedMail = '';
  let i = 0;
  for (const char of email) {
    if (i === 0 || i >= atIndex || char === '.' || email.charAt(i - 1) === '.') {
      encryptedMail += char;
    } else {
      encryptedMail += '*';
    }
    i++;
  }

  if (isVisible) {
    return (
      <Anchor href={`mailto:${email}`}>
        {email}
      </Anchor>
    )
  } else {
    return (
      <UnstyledButton onClick={() => setIsVisible(true)}>
        <Anchor component='div'>
          {isVisible ? email : encryptedMail}
        </Anchor>
      </UnstyledButton>
    )
  }

}

export default EncryptedEmail