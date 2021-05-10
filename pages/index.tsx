import { useState } from 'react'
import styles from './index.module.css'

const nextId = (elements: any[]) => {
  const maxValue = Math.max(...elements.map((element) => element.id))
  return maxValue === -Infinity ? 1 : maxValue + 1
}

const Index = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      columnId: 1,
      text: 'Fist card',
    },
    {
      id: 2,
      columnId: 2,
      text: 'Second card',
    },
    {
      id: 3,
      columnId: 3,
      text: 'Third card',
    },
  ])

  const [columns, setColumns] = useState([
    {
      id: 1,
      name: 'todo',
    },
    {
      id: 2,
      name: 'working',
    },

    {
      id: 3,
      name: 'complete',
    },
  ])

  const onDragOver = (ev: any) => {
    ev.preventDefault()
  }

  const onDragStart = (ev: any, card: any) => {
    ev.dataTransfer.setData('id', card.id)
  }

  const onDrop = (ev: any, columnId: number) => {
    setCards(
      cards.filter((card: any) => {
        if (card.id == ev.dataTransfer.getData('id')) {
          card.columnId = columnId
        }
        return card
      }),
    )
  }

  const handleKeyPress = (ev: any, columnId: number) => {
    if (ev.key == 'Enter' && ev.target.value !== '') {
      setCards([
        ...cards,
        {
          id: nextId(cards),
          text: ev.target.value,
          columnId,
        },
      ])
      ev.target.value = ''
    }
  }

  const newColumn = (ev: any) => {
    if (ev.key == 'Enter' && ev.target.value !== '') {
      setColumns(
        columns.concat({
          id: nextId(columns),
          name: ev.target.value,
        }),
      )
      ev.target.value = ''
    }
  }

  const deleteCard = (id: number) =>
    setCards(cards.filter((card) => card.id !== id))

  const deleteColumn = (id: number) => {
    cards
      .filter((card) => card.columnId === id)
      .forEach((card) => deleteCard(card.id))
    setColumns(columns.filter((column) => column.id !== id))
  }

  return (
    <div className={styles.container}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={styles.column}
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <div className={styles.columnHeader}>
            <h2 className={styles.columnLabel}>{column.name}</h2>
            <button
              className={styles.deleteColumnButton}
              onClick={() => deleteColumn(column.id)}
            >
              Delete
            </button>
          </div>
          <div>
            <input
              onKeyPress={(e) => handleKeyPress(e, column.id)}
              className={styles.input}
              type="text"
              placeholder="New Card"
            />
          </div>
          {cards
            .filter((card) => card.columnId === column.id)
            .map((card) => (
              <div
                className={styles.itemContainer}
                key={card.id}
                draggable
                onDragStart={(e) => onDragStart(e, card)}
              >
                {card.text}
                <button
                  className={styles.deleteCardButton}
                  onClick={() => deleteCard(card.id)}
                >
                  x
                </button>
              </div>
            ))}
        </div>
      ))}

      {columns.length <= 4 && (
        <div className={styles.addNewContainer}>
          Add another list
          <input
            onKeyPress={(e) => newColumn(e)}
            className={styles.input}
            type="text"
            placeholder="New Column"
          />
        </div>
      )}
    </div>
  )
}

export default Index
