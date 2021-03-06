import { Form, Input, Select, Typography } from '@sushiswap/ui'
import { CurrencyInput } from 'components'
import { format } from 'date-fns'
import { stepConfigurations } from 'features/vesting/CreateForm/schema'
import { CreateVestingFormData } from 'features/vesting/CreateForm/types'
import { Controller, useFormContext } from 'react-hook-form'

export const GradedVestingDetailsSection = () => {
  const { control, watch } = useFormContext<CreateVestingFormData>()
  // @ts-ignore
  const [token, stepConfig, cliff, cliffEndDate, startDate, stepPayouts] = watch([
    'token',
    'stepConfig',
    'cliff',
    'cliffEndDate',
    'startDate',
    'stepPayouts',
  ])

  const endDate =
    ((cliff && cliffEndDate) || startDate) && stepPayouts
      ? new Date(
          new Date(cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
        )
      : undefined

  return (
    <Form.Section title="Graded Vesting Details" description="Optionally provide graded vesting details">
      <Form.Control label="Payout per Period">
        <Controller
          control={control}
          name="stepAmount"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CurrencyInput.Base
              onChange={onChange}
              value={value}
              token={token}
              error={!!error?.message}
              helperTextPanel={
                <CurrencyInput.HelperTextPanel
                  text={
                    !!error?.message ? (
                      error.message
                    ) : (
                      <>
                        The amount the recipient receives after every period. For a value of 6 and a{' '}
                        {stepConfig?.label.toLowerCase()} period length, the user will receive 6 {token?.symbol}{' '}
                        {stepConfig?.label.toLowerCase()}.
                      </>
                    )
                  }
                  isError={!!error?.message}
                />
              }
            />
          )}
        />
      </Form.Control>
      <div className="flex flex-col md:flex-row gap-6">
        <Form.Control label="Amount of Periods">
          <Controller
            control={control}
            name="stepPayouts"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input.Counter step={1} min={0} max={100} onChange={onChange} value={value} error={!!error?.message} />
                <Form.Error message={error?.message} />
              </>
            )}
          />
        </Form.Control>
        <Form.Control label="Period Length">
          <Controller
            control={control}
            name="stepConfig"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Select
                  error={!!error?.message}
                  button={<Select.Button>{value.label}</Select.Button>}
                  value={value}
                  onChange={onChange}
                >
                  <Select.Options>
                    {Object.values(stepConfigurations).map((stepConfig) => (
                      <Select.Option key={stepConfig.label} value={stepConfig}>
                        {stepConfig.label}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select>
                <Form.Error message={error?.message} />
              </>
            )}
          />
        </Form.Control>
      </div>
      <Form.Control label="End Date">
        {endDate ? (
          <Typography variant="sm" className="text-slate-50" weight={700}>
            {format(endDate, 'dd MMM yyyy hh:maaa')}
          </Typography>
        ) : (
          <Typography variant="sm" className="text-slate-500 italic">
            Not available
          </Typography>
        )}
      </Form.Control>
    </Form.Section>
  )
}
