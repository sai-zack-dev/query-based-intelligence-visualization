import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const EntitySection = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    customers: true,
    orders: false,
    products: false,
  });

  interface EntityField {
    name: string;
    type: string;
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const entities = {
    customers: [
      { name: "customer_id", type: "int" },
      { name: "name", type: "varchar" },
      { name: "country", type: "varchar?" },
      { name: "email", type: "varchar" },
    ],
    orders: [],
    products: [],
  };

  interface SectionHeaderProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
  }

  const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    isExpanded,
    onToggle,
  }) => (
    <div
      className={`flex items-center cursor-pointer p-2 gap- hover:bg-blue-50 select-none text-blue-500 border-y border-blue-50 ${
        isExpanded ? "bg-blue-50" : "bg-white"}`}
      onClick={onToggle}
    >
      {isExpanded ? (
        <FaChevronDown className="w-3 h-3 mr-1" />
      ) : (
        <FaChevronRight className="w-3 h-3 mr-1" />
      )}
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );

  const FieldItem: React.FC<{ field: EntityField }> = ({ field }) => (
    <div className="flex py-1 px-3 justify-between items-center hover:bg-blue-50">
      <span className="text-gray-700 text-sm">{field.name}</span>
      <span className="text-gray-500 text-xs">{field.type}</span>
    </div>
  );

  return (
    <div className="mt-3">
      <h3 className="input-label font-semibold">Entities</h3>

      <div className="rounded-lg border border-blue-300 overflow-hidden">
        {Object.entries(entities).map(([entityName, fields]) => (
          <div key={entityName}>
            <SectionHeader
              title={entityName.charAt(0).toUpperCase() + entityName.slice(1)}
              isExpanded={expandedSections[entityName]}
              onToggle={() => toggleSection(entityName)}
            />
            {expandedSections[entityName] && (
              <div>
                {fields.length > 0 ? (
                  fields.map((field, index) => (
                    <FieldItem key={index} field={field} />
                  ))
                ) : (
                  <div className="text-gray-500 text-sm pl-6 py-1">
                    No fields defined
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntitySection;
