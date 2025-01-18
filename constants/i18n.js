import * as Localization from "expo-localization";
import I18n from "i18n-js";

// Available translations
I18n.translations = {
  en: {
    // Tab
    homeTab: "Home",
    geolocationTab: "Geolocation",
    relativesTab: "Relatives",
    devicesTab: "Devices",
    profileTab: "Profile",

    // Home Page
    homeTitle: "Find the sound, wherever it is",
    homeSubtitle: "Stay connected, even in case of loss",
    findYourAids: "Find Your Aids",

    // Geolocation Page

    // Relatives Page
    relativesPageTitle: "Contacts To Alert",
    relativesPageSubtitle:
      "Relatives will receive an alert in case of loss of your hearing aids",
    addRelativeButton: "Add a Relative",
    limitRelatives:
      "You cannot add more than 10 contacts. Please, delete the existing ones.",
    allFieldsRequired: "All fields are required.",
    listOfRelatives: "List of Relatives",
    editRelative: "Edit Relative",
    addRelative: "Add a Relative",
    firstname: "Firstname",
    lastname: "Lastname",
    alias: "Alias",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    delete: "Delete",
    editRelativeSubtitle: "Modify information of your relative",
    addRelativeSubtitle:
      "Configure information of your relatives to alert in case of loss",

    // Devices Page
    devicesPageTitle: "Connect Your Hearing Aids",
    addDeviceButton: "Add a device",
    deviceConnectedAlertTitle: "Device Connected",
    deviceConnectedAlertMessage: "Your device is now connected!",
    forgetDeviceAlertTitle: "Forget Device",
    forgetDeviceAlertMessage: "Are you sure you want to forget this device?",
    forgetDeviceConfirm: "Yes",
    forgetDeviceCancel: "Cancel",
    deviceInfoTitle: "Device Info",
    currentLocation: "Current Location",
    forgetDeviceButton: "Forget the device",
    close: "Close",

    // Profile Page
    email: "Email",
    phone: "Phone",
    enterName: "Enter your name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    historic: "Historic",
    error: "Error",
    invalidEmail: "Invalid email address",
    invalidPhone: "Phone number must contain only digits.",
    saveChanges: "Save Changes",
    cancelChanges: "Cancel Changes",
    profileUpdated: "Profile updated successfully!",
    permissionDenied: "Permission denied to access the image library.",
    nameRequired: "Name is required.",
    editingMode: "You are in editing mode",

    // Settings Page
    settings: "SETTINGS",
    enableNotifications: "Enable Notifications",
    enableVibration: "Enable Vibration",
    contactPreferences: "Contact Preferences",
    contactByEmail: "Contact by Email",
    contactByPhone: "Contact by Phone",
    language: "Language",
    goBack: "Go Back",
    hintText:
      "Choose how you prefer to be contacted in case of loss: by email or phone.",
  },
  fr: {
    // Tab
    homeTab: "Accueil",
    geolocationTab: "Géolocalisation",
    relativesTab: "Contacts",
    devicesTab: "Appareils",
    profileTab: "Profil",

    // Home Page
    homeTitle: "Trouvez le son, où qu'il soit",
    homeSubtitle: "Restez connecté(e), même en cas de perte",
    findYourAids: "Trouvez vos appareils",

    // Geolocation Page

    // Relatives Page
    relativesPageTitle: "Contacts À Alerter",
    relativesPageSubtitle:
      "Les proches recevront une alerte en cas de perte de vos appareils auditifs",
    addRelativeButton: "Ajouter un proche",
    limitRelatives:
      "Vous ne pouvez pas ajouter plus de 10 contacts. Veuillez supprimer les contacts existants.",
    allFieldsRequired: "Tous les champs sont obligatoires.",
    listOfRelatives: "Liste des proches",
    editRelative: "Modifier un proche",
    addRelative: "Ajouter un proche",
    firstname: "Prénom",
    lastname: "Nom",
    alias: "Alias",
    save: "Sauvegarder",
    update: "Mettre à jour",
    cancel: "Annuler",
    delete: "Supprimer",
    editRelativeSubtitle: "Modifier les informations de votre proche",
    addRelativeSubtitle:
      "Configurez les informations de vos proches à alerter en cas de perte",

    // Devices Page
    devicesPageTitle: "Connectez Vos Appareils Auditifs",
    addDeviceButton: "Ajouter un appareil",
    deviceConnectedAlertTitle: "Appareil connecté",
    deviceConnectedAlertMessage: "Votre appareil est maintenant connecté !",
    forgetDeviceAlertTitle: "Oublier l'appareil",
    forgetDeviceAlertMessage: "Êtes-vous sûr de vouloir oublier cet appareil ?",
    forgetDeviceConfirm: "Oui",
    forgetDeviceCancel: "Annuler",
    deviceInfoTitle: "Informations sur l'appareil",
    currentLocation: "Localisation actuelle",
    forgetDeviceButton: "Oublier l'appareil",
    close: "Fermer",

    // Profile Page
    email: "Email",
    phone: "Téléphone",
    enterName: "Entrez votre nom",
    enterEmail: "Entrez votre email",
    enterPhone: "Entrez votre numéro de téléphone",
    historic: "Historique",
    error: "Erreur",
    invalidEmail: "Adresse email invalide",
    invalidPhone:
      "Le numéro de téléphone doit contenir uniquement des chiffres.",
    saveChanges: "Sauvegarder les modifications",
    cancelChanges: "Annuler les modifications",
    profileUpdated: "Profil mis à jour avec succès !",
    permissionDenied:
      "Permission refusée pour accéder à la bibliothèque d'images.",
    nameRequired: "Le nom est requis.",
    editingMode: "Vous êtes en mode édition",

    // Settings Page
    settings: "PARAMÈTRES",
    enableNotifications: "Activer les notifications",
    enableVibration: "Activer la vibration",
    contactPreferences: "Préférences de contact",
    contactByEmail: "Contact par email",
    contactByPhone: "Contact par téléphone",
    language: "Langue",
    goBack: "Retour",
    hintText:
      "Choisissez comment vous préférez être contacté(e) en cas de perte : par email ou téléphone.",
  },
  es: {
    // Tab
    homeTab: "Inicio",
    geolocationTab: "Geolocalización",
    relativesTab: "Contactos",
    devicesTab: "Dispositivos",
    profileTab: "Perfil",

    // Home Page
    homeTitle: "Encuentra el sonido, donde sea que esté",
    homeSubtitle: "Mantente conectado, incluso en caso de pérdida",
    findYourAids: "Encuentra tus dispositivos",

    // Geolocation Page

    // Relatives Page
    relativesPageTitle: "Contactos Para Alertar",
    relativesPageSubtitle:
      "Los familiares recibirán una alerta en caso de pérdida de sus audífonos",
    addRelativeButton: "Agregar un familiar",
    limitRelatives:
      "No puede añadir más de 10 contactos. Por favor, elimine los existentes.",
    allFieldsRequired: "Todos los campos son obligatorios.",
    listOfRelatives: "Lista de familiares",
    editRelative: "Editar un familiar",
    addRelative: "Agregar un familiar",
    firstname: "Nombre",
    lastname: "Apellido",
    alias: "Alias",
    save: "Guardar",
    update: "Actualizar",
    cancel: "Cancelar",
    delete: "Eliminar",
    editRelativeSubtitle: "Modificar la información de su familiar",
    addRelativeSubtitle:
      "Configure la información de sus familiares para alertarlos en caso de pérdida",

    // Devices Page
    devicesPageTitle: "Conecta Tus Audífonos",
    addDeviceButton: "Agregar un dispositivo",
    deviceConnectedAlertTitle: "Dispositivo conectado",
    deviceConnectedAlertMessage: "¡Tu dispositivo ahora está conectado!",
    forgetDeviceAlertTitle: "Olvidar dispositivo",
    forgetDeviceAlertMessage:
      "¿Estás seguro de que deseas olvidar este dispositivo?",
    forgetDeviceConfirm: "Sí",
    forgetDeviceCancel: "Cancelar",
    deviceInfoTitle: "Información del dispositivo",
    currentLocation: "Ubicación actual",
    forgetDeviceButton: "Olvidar dispositivo",
    close: "Cerrar",

    // Profile Page
    email: "Correo electrónico",
    phone: "Teléfono",
    enterName: "Introduce tu nombre",
    enterEmail: "Introduce tu correo electrónico",
    enterPhone: "Introduce tu número de teléfono",
    historic: "Historial",
    settings: "Configuraciones",
    error: "Error",
    invalidEmail: "Dirección de correo electrónico no válida",
    invalidPhone: "El número de teléfono debe contener solo dígitos.",
    nameRequired: "Se requiere el nombre.",
    saveChanges: "Guardar cambios",
    cancelChanges: "Cancelar cambios",
    profileUpdated: "¡Perfil actualizado con éxito!",
    permissionDenied:
      "Permiso denegado para acceder a la biblioteca de imágenes.",
    editingMode: "Estás en modo de edición",

    // Settings Page
    settings: "AJUSTES",
    enableNotifications: "Activar notificaciones",
    enableVibration: "Activar vibración",
    contactPreferences: "Preferencias de contacto",
    contactByEmail: "Contacto por correo electrónico",
    contactByPhone: "Contacto por teléfono",
    language: "Idioma",
    goBack: "Volver",
    hintText:
      "Elija cómo prefiere ser contactado en caso de pérdida: por correo electrónico o teléfono.",
  },
  de: {
    // Tab
    homeTab: "Startseite",
    geolocationTab: "Geolokalisierung",
    relativesTab: "Kontakte",
    devicesTab: "Geräte",
    profileTab: "Profil",

    // Home Page
    homeTitle: "Finden Sie den Klang, wo auch immer er ist",
    homeSubtitle: "Bleiben Sie verbunden, auch im Verlustfall",
    findYourAids: "Finden Sie Ihre Hörgeräte",

    // Geolocation Page

    // Relatives Page
    relativesPageTitle: "Kontakte Zum Benachrichtigen",
    relativesPageSubtitle:
      "Verwandte werden im Verlustfall Ihrer Hörgeräte benachrichtigt",
    addRelativeButton: "Einen Verwandten hinzufügen",
    limitRelatives:
      "Sie können nicht mehr als 10 Kontakte hinzufügen. Bitte löschen Sie die vorhandenen.",
    allFieldsRequired: "Alle Felder sind erforderlich",
    listOfRelatives: "Liste der Verwandten",
    editRelative: "Einen Verwandten bearbeiten",
    addRelative: "Einen Verwandten hinzufügen",
    firstname: "Vorname",
    lastname: "Name",
    alias: "Alias",
    save: "Speichern",
    update: "Aktualisieren",
    cancel: "Abbrechen",
    delete: "Löschen",
    editRelativeSubtitle: "Informationen Ihres Verwandten bearbeiten",
    addRelativeSubtitle:
      "Konfigurieren Sie die Informationen Ihrer Verwandten, um sie im Verlustfall zu benachrichtigen",

    // Devices Page
    devicesPageTitle: "Verbinden Sie Ihre Hörgeräte",
    addDeviceButton: "Ein Gerät hinzufügen",
    deviceConnectedAlertTitle: "Gerät verbunden",
    deviceConnectedAlertMessage: "Ihr Gerät ist jetzt verbunden!",
    forgetDeviceAlertTitle: "Gerät vergessen",
    forgetDeviceAlertMessage: "Möchten Sie dieses Gerät wirklich vergessen?",
    forgetDeviceConfirm: "Ja",
    forgetDeviceCancel: "Abbrechen",
    deviceInfoTitle: "Geräteinformationen",
    currentLocation: "Aktueller Standort",
    forgetDeviceButton: "Gerät vergessen",
    close: "Schließen",

    // Profile Page
    email: "E-Mail",
    phone: "Telefon",
    enterName: "Geben Sie Ihren Namen ein",
    enterEmail: "Geben Sie Ihre E-Mail-Adresse ein",
    enterPhone: "Geben Sie Ihre Telefonnummer ein",
    historic: "Verlauf",
    settings: "Einstellungen",
    error: "Fehler",
    invalidEmail: "Ungültige E-Mail-Adresse",
    invalidPhone: "Die Telefonnummer darf nur Ziffern enthalten.",
    nameRequired: "Der Name ist erforderlich.",
    saveChanges: "Änderungen speichern",
    cancelChanges: "Änderungen abbrechen",
    profileUpdated: "Profil erfolgreich aktualisiert!",
    permissionDenied: "Zugriff auf die Bilderbibliothek verweigert.",
    editingMode: "Sie befinden sich im Bearbeitungsmodus",

    // Settings Page
    settings: "EINSTELLUNGEN",
    enableNotifications: "Benachrichtigungen aktivieren",
    enableVibration: "Vibration aktivieren",
    contactPreferences: "Kontaktpräferenzen",
    contactByEmail: "Kontakt per E-Mail",
    contactByPhone: "Kontakt per Telefon",
    language: "Sprache",
    goBack: "Zurück",
    hintText:
      "Wählen Sie, wie Sie im Verlustfall kontaktiert werden möchten: per E-Mail oder Telefon.",
  },
  it: {
    // Tab
    homeTab: "Home",
    geolocationTab: "Geolocalizzazione",
    relativesTab: "Contatti",
    devicesTab: "Dispositivi",
    profileTab: "Profilo",

    // Home Page
    homeTitle: "Trova il suono, ovunque sia",
    homeSubtitle: "Rimani connesso, anche in caso di perdita",
    findYourAids: "Trova i tuoi dispositivi",

    // Geolocation Page

    // Relatives Page
    relativesPageTitle: "Contatti Da Avvisare",
    relativesPageSubtitle:
      "I parenti riceveranno un avviso in caso di perdita degli apparecchi acustici",
    addRelativeButton: "Aggiungi un parente",
    limitRelatives:
      "Non puoi aggiungere più di 10 contatti. Per favore, elimina quelli esistenti.",
    allFieldsRequired: "Tutti i campi sono obbligatori.",
    listOfRelatives: "Elenco dei parenti",
    editRelative: "Modifica un parente",
    addRelative: "Aggiungi un parente",
    firstname: "Nome",
    lastname: "Cognome",
    alias: "Alias",
    save: "Salva",
    update: "Aggiorna",
    cancel: "Annulla",
    delete: "Elimina",
    editRelativeSubtitle: "Modifica le informazioni del tuo parente",
    addRelativeSubtitle:
      "Configura le informazioni dei tuoi parenti da avvisare in caso di perdita",

    // Devices Page
    devicesPageTitle: "Collega I Tuoi Apparecchi Acustici",
    addDeviceButton: "Aggiungi un dispositivo",
    deviceConnectedAlertTitle: "Dispositivo connesso",
    deviceConnectedAlertMessage: "Il tuo dispositivo è ora connesso!",
    forgetDeviceAlertTitle: "Dimentica dispositivo",
    forgetDeviceAlertMessage:
      "Sei sicuro di voler dimenticare questo dispositivo?",
    forgetDeviceConfirm: "Sì",
    forgetDeviceCancel: "Annulla",
    deviceInfoTitle: "Informazioni sul dispositivo",
    currentLocation: "Posizione attuale",
    forgetDeviceButton: "Dimentica dispositivo",
    close: "Chiudere",

    // Profile Page
    email: "Email",
    phone: "Telefono",
    enterName: "Inserisci il tuo nome",
    enterEmail: "Inserisci la tua email",
    enterPhone: "Inserisci il tuo numero di telefono",
    historic: "Storico",
    settings: "Impostazioni",
    error: "Errore",
    invalidEmail: "Indirizzo email non valido",
    invalidPhone: "Il numero di telefono deve contenere solo cifre.",
    nameRequired: "Il nome è richiesto.",
    saveChanges: "Salva modifiche",
    cancelChanges: "Annulla modifiche",
    profileUpdated: "Profilo aggiornato con successo!",
    permissionDenied: "Permesso negato per accedere alla libreria di immagini.",
    editingMode: "Sei in modalità di modifica",

    // Settings Page
    settings: "IMPOSTAZIONI",
    enableNotifications: "Attiva notifiche",
    enableVibration: "Attiva vibrazione",
    contactPreferences: "Preferenze di contatto",
    contactByEmail: "Contatto via email",
    contactByPhone: "Contatto telefonico",
    language: "Lingua",
    goBack: "Torna indietro",
    hintText:
      "Scegli come preferisci essere contattato in caso di smarrimento: tramite email o telefono.",
  },
};

// Enable fallback if a key is not found
I18n.fallbacks = true;

// Set the default language based on phone location
I18n.locale = Localization.locale;

export default I18n;
