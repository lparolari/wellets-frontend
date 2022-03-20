import {
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import AdvancedSelect, { IOption } from 'Components/Atoms/AdvancedSelect';
import Button from 'Components/Atoms/Button';
import ICurrency from 'Entities/ICurrency';
import useCurrencyData from 'Hooks/useCurrencyData';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';

const toOption = (currency: ICurrency) => ({
  value: currency.id.toString(),
  label: currency.acronym,
});

const getChangeRate = (changeCurrency: ICurrency, changeValue: number) => {
  const dollarValue = Number(changeValue) / changeCurrency.dollar_rate;
  const dollarRate = 1 / dollarValue;

  return dollarRate;
};

type IProps = React.ComponentProps<typeof Button> & {
  baseCurrency: ICurrency;
  targetCurrency: ICurrency;
  onSuccess?: (changeRate: number) => void;
  onCancel?: () => void;
  onClose?: () => void;
};

const ChangeRate = ({
  baseCurrency,
  targetCurrency,
  onSuccess,
  onCancel,
  onClose,
  ...rest
}: IProps) => {
  const { currencies } = useCurrencyData();

  const [changeCurrency, setChangeCurrency] = useState<ICurrency>(baseCurrency);
  const [changeValue, setChangeValue] = useState('');

  const [modal, showModal] = useState(false);

  const openModal = () => showModal(true);
  const closeModal = () => showModal(false);

  const handleSuccess = () => {
    closeModal();
    const changeValueNum = Number(changeValue);
    if (onSuccess && R.is(Number, changeValueNum)) {
      onSuccess(getChangeRate(changeCurrency, changeValueNum));
    }
  };
  const handleCancel = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  const handleClose = () => {
    closeModal();
    if (onClose) onClose();
  };

  useEffect(() => {
    const valueInTargetCurrency = 1 / targetCurrency.dollar_rate;
    const valueInChosenCurrency =
      valueInTargetCurrency * changeCurrency.dollar_rate;

    setChangeValue(valueInChosenCurrency.toString());
  }, [changeCurrency.dollar_rate, targetCurrency.dollar_rate]);

  return (
    <>
      <Button onClick={openModal} pr="2rem" pl="2rem" {...rest}>
        Set change rate
      </Button>

      <Modal isOpen={modal} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set change rate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="column" spacing="5">
              <FormControl>
                <InputGroup>
                  <Input
                    type="number"
                    value={changeValue}
                    onChange={e => setChangeValue(e.target.value)}
                    placeholder={`${changeCurrency.alias} rate (empty means current rate)`}
                    variant="outline"
                    onKeyUp={e => {
                      if (e.key === 'Enter') {
                        handleSuccess();
                      }
                    }}
                  />
                </InputGroup>
                <FormHelperText>{`1 ${targetCurrency.acronym} equivalent to ? ${changeCurrency.acronym}`}</FormHelperText>
              </FormControl>
              <FormControl>
                <AdvancedSelect
                  onChange={(v: IOption | null) =>
                    v &&
                    setChangeCurrency(
                      (currencies
                        ? currencies.find(c => c.id === v.value)
                        : baseCurrency) || baseCurrency,
                    )
                  }
                  options={currencies ? currencies.map(toOption) : []}
                  value={toOption(changeCurrency)}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSuccess} isPrimary>
              Set
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeRate;
