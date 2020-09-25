import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Alert from '../../components/Alert'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/theme/Button'
import REMOVE_ALERT from '../../graphql/queries/removeAlert'
import { withGetApp, GetAppProps, Alert as AlertType } from '../../graphql'
import noop from '../../helpers/noop'
import Card from '../../components/Card'

type AlertRowProps = {
  alerts: AlertType[]
  alert: AlertType
  setAlerts: React.Dispatch<React.SetStateAction<AlertType[]>>
}

const AlertRow: React.FC<AlertRowProps> = ({ alerts, alert, setAlerts }) => {
  const [removeAlert] = useMutation(REMOVE_ALERT)

  const removeDatAlert = async (id: string) => {
    try {
      await removeAlert({ variables: { id } })
      const newAlerts = alerts.filter((alert: AlertType) => alert.id !== id)
      setAlerts(newAlerts)
    } catch (err) {
      throw new Error(err)
    }
  }

  return (
    <div className="row">
      <div className="d-flex flex-column col-10">
        <Alert alert={alert} onDismiss={noop} />
      </div>
      <div className="d-flex flex-column col-2 mt-3 justify-content-center">
        <Button
          type="danger"
          onClick={() =>
            confirm('Are you sure you want to delete this alert?') &&
            removeDatAlert(alert.id)
          }
          color="white"
        >
          Remove Alert
        </Button>
      </div>
    </div>
  )
}

const Alerts: React.FC<GetAppProps> = ({ data }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([])

  // useEffect needed to update `alerts` state after data has finished loading alerts
  useEffect(() => {
    if (!data.error && !data.loading) {
      setAlerts(data.alerts as AlertType[])
    }
  }, [data])

  const currentAlerts = alerts.map((alert: AlertType, key: number) => (
    <AlertRow alerts={alerts} alert={alert} key={key} setAlerts={setAlerts} />
  ))

  return (
    <AdminLayout data={data}>
      <Card
        primary={true}
        title="Alerts"
        classes="col-12"
        text="Add new messages you want c0d3.com students to see or remove old and outdated alerts!"
      />
      <Card
        primary={true}
        title="Current Alerts"
        classes="col-12"
        text="These alerts are what every students see when they are on their
        dashboard page."
      >
        {currentAlerts}
      </Card>
    </AdminLayout>
  )
}

export default withGetApp()(Alerts)