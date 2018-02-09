import React from 'react'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'

const EventCard = ({ event }) => (
  <Card>
    <CardHeader
      title={event.title}
      //subtitle={event.startDate}
      subtitle="päivämäärät, alku ja loppu"
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardText expandable={true}>
      Tänne sitten muut tiedot, vähän kuten eventin luomisessa.
      <br />
      <br />
      Vähän alemmaksi sitten aktiviteettien lisääminen hakuineen jne.
      <br />
      <br />
      Ja aktiviteetteja voisi sitten siirrellä näppärästi näiden välillä, kun ovat kaikki näkyvissä.
      <br />
      <br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.1
    </CardText>
  </Card>
)

export default EventCard