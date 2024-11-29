import React from 'react'
import Card from '../Card/Card'
import { mockPlaces } from '../../utils/mock';

const ListCards = () => {

    const displayPlaces = mockPlaces.map((place,index) => {
        return (
        <Card key={index}
          images={place.image}
          title={place.name}
          description={place.description}
        />)
      })

return (
    <>
        {displayPlaces}
    </>
      )
    
}

export default ListCards