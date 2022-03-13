import React from 'react';

import AuthProvider from './auth';
import ErrorsProvider from './errors';

const providers = [AuthProvider, ErrorsProvider];

const CombineProviders: React.FC = ({ children }) => (
  <>
    {providers.reduceRight(
      (acc, Comp, i) => (
        <Comp key={i}>{acc}</Comp>
      ),
      children,
    )}
  </>
);

export default CombineProviders;
