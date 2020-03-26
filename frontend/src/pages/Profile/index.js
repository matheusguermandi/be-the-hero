import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { FiPower, FiTrash2 } from "react-icons/fi"

import api from "../../services/api"

import "./styles.css"
import Logo from "../../components/Logo"

export default function Profile() {
  const [incidents, setIncidents] = useState([])
  const history = useHistory()
  const ongId = localStorage.getItem("ongId")
  const ongName = localStorage.getItem("ongName")

  useEffect(() => {
    async function getIncidents(ongId) {
      try {
        const response = await api.get("profile", {
          headers: {
            Authorization: ongId
          }
        })

        setIncidents(response.data)
      } catch (error) {
        alert("Erro ao buscar os casos, tente novamente.")
      }
    }

    getIncidents(ongId)
  }, [ongId])

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      })

      setIncidents(incidents.filter(incident => incident.id !== id))
    } catch (error) {
      alert("Erro ao deletar o caso, tente novamente.")
    }
  }

  function handleLogout() {
    localStorage.clear()
    history.push("/")
  }

  return (
    <div className="profile-container">
      <header>
        <Logo />
        <span>Bem vinda, {ongName}</span>

        <Link to="/incidents/new" className="button">
          Cadastrar novo caso
        </Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={20} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastratos</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p className="description">{incident.description}</p>

            <strong>VALOR:</strong>
            <p>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </p>

            <button
              type="button"
              onClick={() => handleDeleteIncident(incident.id)}
            >
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
