// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { isEmail, isUrl } from '../util/utils';
import Label from './Label';
import { Input } from './TextInputs';

interface Props {
  className?: string;
  defaultValue?: string | null;
  disabled?: boolean;
  isError?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  label: string;
  labelFontSize?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  value?: string;
  withoutMargin?: boolean;
  height?: number;
  fontSize?: number;
  fontWeight?: number;
  helperText?: string;
  type?: string;
}

function InputWithLabel({ className, defaultValue, disabled, fontSize = 18, fontWeight = 300, height = 31, helperText, isError, isFocused, isReadOnly, label = '', labelFontSize = '14px', onChange, onEnter, placeholder, type = 'text', value, withoutMargin }: Props): React.ReactElement<Props> {
  const [offFocus, setOffFocus] = useState(false);
  const theme = useTheme();

  const badInput = useMemo(() => {
    if (!type || !value) {
      return false;
    }

    if (type === 'email') {
      return !isEmail(value);
    }

    if (type === 'url') {
      return !isUrl(value);
    }

    return false;
  }, [type, value]);

  const _checkKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      onEnter && event.key === 'Enter' && onEnter();
    },
    [onEnter]
  );

  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
      onChange && onChange(value);
    },
    [onChange]
  );

  const _setOffFocus = useCallback(() => {
    setOffFocus(true);
  }, []);

  return (
    <Label
      className={`${className || ''} ${withoutMargin ? 'withoutMargin' : ''}`}
      helperText={helperText}
      label={label}
      style={{ fontSize: labelFontSize, position: 'relative', letterSpacing: '-0.015em', width: '100%' }}
    >
      <Input
        autoCapitalize='off'
        autoCorrect='off'
        autoFocus={!offFocus && isFocused}
        defaultValue={defaultValue || undefined}
        disabled={disabled}
        onBlur={_setOffFocus}
        onChange={_onChange}
        onKeyPress={_checkKey}
        placeholder={placeholder}
        readOnly={isReadOnly}
        spellCheck={false}
        style={{
          borderColor: (isError || badInput) ? theme.palette.warning.main : theme.palette.secondary.light,
          borderWidth: (isError || badInput) ? '3px' : '1px',
          fontSize: `${fontSize}px`,
          fontWeight: { fontWeight },
          height: `${height}px`,
          padding: 0,
          paddingLeft: '10px'
        }}
        theme={theme}
        type={type}
        value={value}
        withError={offFocus && (isError || badInput)}
      />
    </Label>
  );
}

export default styled(InputWithLabel)`
  &.withoutMargin {
    margin: 0;

   + .danger {
      margin-top: 6px;
    }
  }
`;
