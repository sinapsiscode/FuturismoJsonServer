import PropTypes from 'prop-types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FilterSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-200 pb-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 text-left hover:text-cyan-600 transition-colors"
    >
      <span className="font-medium text-gray-900">{title}</span>
      {isExpanded ? (
        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      )}
    </button>
    {isExpanded && <div className="mt-3">{children}</div>}
  </div>
);

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default FilterSection;