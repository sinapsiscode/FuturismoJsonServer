import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page, View } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

// Estilos
import { pdfStyles as styles } from '../../styles/pdfStyles';

// Componentes PDF
import PDFHeader from './PDFHeader';
import PDFTourInfo from './PDFTourInfo';
import PDFTeamSection from './PDFTeamSection';
import PDFTouristList from './PDFTouristList';
import PDFNotesSection from './PDFNotesSection';
import PDFFooter from './PDFFooter';

const TourAssignmentBrochurePDF = ({ assignment }) => {
  const { t } = useTranslation();
  
  if (!assignment) {
    return null;
  }

  const {
    tourDate,
    tourTime,
    tourName,
    groupSize,
    agency,
    guide,
    driver,
    vehicle,
    tourists = [],
    pickup,
    notes,
    emergencyInfo,
    language
  } = assignment;

  const tourData = {
    tourDate,
    tourTime,
    tourName,
    groupSize,
    agency,
    guide,
    driver,
    vehicle,
    pickup,
    language
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          tourName={tourName}
          tourDate={tourDate}
          tourTime={tourTime}
          t={t}
        />
        
        <PDFTourInfo 
          tourData={tourData}
          t={t}
        />
        
        <PDFTeamSection 
          guide={guide}
          driver={driver}
          t={t}
        />
        
        <PDFTouristList 
          tourists={tourists}
          t={t}
        />
        
        <PDFNotesSection 
          notes={notes}
          emergencyInfo={emergencyInfo}
          t={t}
        />
        
        <PDFFooter t={t} />
      </Page>
    </Document>
  );
};

TourAssignmentBrochurePDF.propTypes = {
  assignment: PropTypes.shape({
    tourDate: PropTypes.string.isRequired,
    tourTime: PropTypes.string.isRequired,
    tourName: PropTypes.string.isRequired,
    groupSize: PropTypes.number.isRequired,
    agency: PropTypes.object,
    guide: PropTypes.object,
    driver: PropTypes.object,
    vehicle: PropTypes.object,
    tourists: PropTypes.array,
    pickup: PropTypes.object,
    notes: PropTypes.string,
    emergencyInfo: PropTypes.object,
    language: PropTypes.string
  })
};

export default TourAssignmentBrochurePDF;