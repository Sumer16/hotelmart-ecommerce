import { Step, StepLabel, Stepper } from '@mui/material'

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {
        ['Login', 'Payment Method', 'Place an order'].map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))
      }
    </Stepper>
  )
}
