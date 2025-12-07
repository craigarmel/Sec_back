import { Controller, Get } from '@nestjs/common';

/**
 * Contrôleur pour les pages de conformité RGPD
 * Conforme à la section 6.3 de la checklist de sécurité
 */
@Controller('legal')
export class LegalController {
  @Get('privacy')
  getPrivacyPolicy() {
    return {
      title: 'Politique de Confidentialité',
      content: `
        <h1>Politique de Confidentialité</h1>
        <h2>Qui sommes-nous ?</h2>
        <p>Cette application de blog est développée dans le cadre d'un projet éducatif.</p>
        
        <h2>Quelles données collectons-nous ?</h2>
        <p>Nous collectons uniquement les données minimales nécessaires :</p>
        <ul>
          <li>Email : pour l'authentification et la communication</li>
          <li>Nom : pour personnaliser l'expérience utilisateur</li>
          <li>Mot de passe : hashé avec bcrypt, jamais stocké en clair</li>
        </ul>
        
        <h2>Comment utilisons-nous vos données ?</h2>
        <p>Vos données sont utilisées uniquement pour :</p>
        <ul>
          <li>L'authentification et la gestion de votre compte</li>
          <li>L'affichage de votre nom sur vos articles et commentaires</li>
        </ul>
        
        <h2>Vos droits</h2>
        <p>Conformément au RGPD, vous avez le droit de :</p>
        <ul>
          <li>Accéder à vos données personnelles</li>
          <li>Modifier vos données personnelles</li>
          <li>Demander la suppression de vos données</li>
          <li>Retirer votre consentement à tout moment</li>
        </ul>
        
        <h2>Contact</h2>
        <p>Pour toute question concernant vos données, contactez-nous via l'application.</p>
      `,
    };
  }

  @Get('terms')
  getTermsOfService() {
    return {
      title: 'Conditions d\'Utilisation',
      content: `
        <h1>Conditions d'Utilisation</h1>
        <h2>Acceptation des conditions</h2>
        <p>En utilisant cette application, vous acceptez les conditions suivantes.</p>
        
        <h2>Utilisation du service</h2>
        <p>Vous vous engagez à :</p>
        <ul>
          <li>Ne pas publier de contenu illégal, offensant ou diffamatoire</li>
          <li>Respecter les droits de propriété intellectuelle</li>
          <li>Ne pas tenter de contourner les mesures de sécurité</li>
        </ul>
        
        <h2>Responsabilité</h2>
        <p>Vous êtes responsable du contenu que vous publiez sur cette plateforme.</p>
      `,
    };
  }
}

