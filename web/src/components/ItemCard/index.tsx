import React from 'react'

import './styles.css'

interface ItemCardProps {
  cardData: {
    id: number
    title: string
    image_url: string
  }
  selectedCards: number[]
  onHandleSelect: (id: number) => void
}

const ItemCard: React.FC<ItemCardProps> = ({
  cardData,
  selectedCards,
  onHandleSelect
}) => {
  return (
    <li
      onClick={() => onHandleSelect(cardData.id)}
      className={selectedCards.includes(cardData.id) ? 'selected' : ''}
    >
      <img src={cardData.image_url} alt={cardData.title} />
      <span>{cardData.title}</span>
    </li>
  )
}

export default ItemCard
