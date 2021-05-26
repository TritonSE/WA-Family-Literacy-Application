import React from 'react';

import styles from './Checkbox.module.css';

type CheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label: string };

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, className, ...rest }) => {
  return (
    <label className={className} htmlFor={id}>
      {label}
      <input id={id} className={styles.input} type="checkbox" {...rest} />
      <span className={styles.checkmark} />
    </label>
  );
};
