export const ISO27001_CONTROLS = {
  "A.5": {
    title: "Contrôles Organisationnels",
    icon: "fa-building",
    color: "#3498db",
    controls: [
      { id: "A.5.1", name: "Politiques de sécurité de l'information", description: "Politiques pour la sécurité de l'information définies, approuvées, publiées et communiquées" },
      { id: "A.5.2", name: "Rôles et responsabilités en sécurité de l'information", description: "Les rôles et responsabilités en matière de sécurité de l'information sont définis et alloués" },
      { id: "A.5.3", name: "Séparation des tâches", description: "Les tâches et zones de responsabilité conflictuelles sont séparées" },
      { id: "A.5.4", name: "Responsabilités de la direction", description: "La direction exige que tout le personnel applique la sécurité de l'information" },
      { id: "A.5.5", name: "Contact avec les autorités", description: "Contacts appropriés avec les autorités pertinentes maintenus" },
      { id: "A.5.6", name: "Contact avec les groupes d'intérêt spéciaux", description: "Contacts avec groupes d'intérêt spéciaux et forums professionnels" },
      { id: "A.5.7", name: "Threat intelligence", description: "Informations relatives aux menaces de sécurité de l'information collectées et analysées" },
      { id: "A.5.8", name: "Sécurité de l'information dans la gestion de projet", description: "La sécurité de l'information est intégrée à la gestion de projet" },
      { id: "A.5.9", name: "Inventaire des informations et autres actifs", description: "Un inventaire des informations, autres actifs et propriétaires est développé et maintenu" },
      { id: "A.5.10", name: "Utilisation acceptable de l'information", description: "Règles pour l'utilisation acceptable de l'information et des actifs identifiées et documentées" },
    ]
  },
  "A.6": {
    title: "Contrôles liés au Personnel",
    icon: "fa-users",
    color: "#e74c3c",
    controls: [
      { id: "A.6.1", name: "Sélection", description: "Les vérifications des antécédents de tous les candidats sont effectuées avant embauche" },
      { id: "A.6.2", name: "Termes et conditions d'emploi", description: "Les accords contractuels avec le personnel et contractants stipulent leurs responsabilités et celles de l'organisation" },
      { id: "A.6.3", name: "Sensibilisation, éducation et formation à la sécurité de l'information", description: "Le personnel et parties concernées reçoivent une sensibilisation, éducation et formation appropriées" },
      { id: "A.6.4", name: "Processus disciplinaire", description: "Un processus disciplinaire formel et communiqué est en place pour traiter les violations de sécurité" },
      { id: "A.6.5", name: "Responsabilités après fin ou changement d'emploi", description: "Les responsabilités et devoirs de sécurité qui restent valides après la fin ou le changement d'emploi sont définies et appliquées" },
    ]
  },
  "A.7": {
    title: "Contrôles Physiques",
    icon: "fa-door-closed",
    color: "#f39c12",
    controls: [
      { id: "A.7.1", name: "Périmètres de sécurité physique", description: "Des périmètres de sécurité sont définis et utilisés pour protéger les zones contenant des informations sensibles" },
      { id: "A.7.2", name: "Entrée physique", description: "Les zones sécurisées sont protégées par des contrôles d'entrée appropriés" },
      { id: "A.7.3", name: "Sécurisation des bureaux, salles et installations", description: "Sécurité physique des bureaux, salles et installations conçue et mise en œuvre" },
      { id: "A.7.4", name: "Surveillance de la sécurité physique", description: "Les locaux sont surveillés en continu contre les accès physiques non autorisés" },
    ]
  },
  "A.8": {
    title: "Contrôles Technologiques",
    icon: "fa-laptop-code",
    color: "#9b59b6",
    controls: [
      { id: "A.8.1", name: "Dispositifs de point de terminaison des utilisateurs", description: "Les informations stockées sur, traitées par ou accessibles via les dispositifs de point de terminaison sont protégées" },
      { id: "A.8.2", name: "Droits d'accès privilégiés", description: "L'allocation et l'utilisation des droits d'accès privilégiés sont restreintes et gérées" },
      { id: "A.8.3", name: "Restriction d'accès à l'information", description: "L'accès à l'information et autres actifs associés est restreint conformément à la politique de contrôle d'accès" },
      { id: "A.8.5", name: "Authentification sécurisée", description: "Technologies et procédures d'authentification sécurisée mises en œuvre" },
    ]
  }
}

export const STATUS_OPTIONS = [
  { value: 'compliant', label: 'Conforme', color: '#27ae60' },
  { value: 'partial', label: 'Partiel', color: '#f39c12' },
  { value: 'non-compliant', label: 'Non conforme', color: '#e74c3c' },
  { value: 'not-evaluated', label: 'Non évalué', color: '#95a5a6' },
]

export const getStatusColor = (status) => {
  const option = STATUS_OPTIONS.find(opt => opt.value === status)
  return option ? option.color : '#95a5a6'
}

export const getStatusLabel = (status) => {
  const option = STATUS_OPTIONS.find(opt => opt.value === status)
  return option ? option.label : 'Inconnu'
}
