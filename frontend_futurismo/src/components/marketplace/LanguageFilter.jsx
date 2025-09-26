import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../constants/marketplaceConstants';

const LanguageFilter = ({ selectedLanguages, onLanguageToggle }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-2">
      {LANGUAGES.map(lang => (
        <label
          key={lang.code}
          className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
        >
          <input
            type="checkbox"
            checked={selectedLanguages.includes(lang.code)}
            onChange={() => onLanguageToggle(lang.code)}
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            {t(lang.name)}
          </span>
        </label>
      ))}
    </div>
  );
};

LanguageFilter.propTypes = {
  selectedLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLanguageToggle: PropTypes.func.isRequired
};

export default LanguageFilter;