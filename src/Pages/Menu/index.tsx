import React from 'react';
import { Grid, useBreakpointValue } from '@chakra-ui/react';

import Wallet from 'Assets/Icons/Wallet';
import Unknown from 'Assets/Icons/Unknown';
import Bitcoin from 'Assets/Icons/Bitcoin';

import PageContainer from 'Components/Atoms/PageContainer';
import ContentContainer from 'Components/Atoms/ContentContainer';
import MenuItem from 'Components/Molecules/MenuItem';
import Header from 'Components/Organisms/Header';

const Menu: React.FC = () => {
  const gridTemplate = useBreakpointValue({
    base: {
      columns: '1fr',
      rows: 'repeat(3, 1fr)',
    },
    md: {
      columns: 'repeat(3, 1fr)',
      rows: '1fr',
    },
  });

  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <Grid
          templateColumns={gridTemplate?.columns}
          templateRows={gridTemplate?.rows}
          gap="25px"
          h="100%"
        >
          <MenuItem
            icon={Bitcoin}
            items={[
              'Create a new custom currency',
              'View your custom currencies',
              'Manage your custom currencies',
            ]}
            palette={['#4299E1', '#63B3ED', '#3182CE', '#4299E1']}
            title="Currencies"
            link="/currencies"
          />
          <MenuItem
            icon={Wallet}
            items={[
              'Create a new wallet',
              'View your wallets',
              'Manage your wallets',
              'Create transactions',
              'View your transaction history',
              'Create transafers',
              'View your transfer history',
            ]}
            palette={['#48BB78', '#68D391', '#38A169', '#48BB78']}
            title="Wallets"
            link="/wallets"
          />
          <MenuItem
            icon={Unknown}
            items={['Check our roadmap and help us to unlock this character']}
            palette={['#9F7AEA', '#B794F4', '#805AD5', '#9F7AEA']}
            title="Coming soon"
            link="/"
          />
        </Grid>
      </ContentContainer>
    </PageContainer>
  );
};

export default Menu;
