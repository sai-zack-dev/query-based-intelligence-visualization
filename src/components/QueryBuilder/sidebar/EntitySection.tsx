import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";

interface EntitySectionProps {
  selectedDatabase: string | null;
}

const EntitySection: React.FC<EntitySectionProps> = ({ selectedDatabase }) => {
  const {
    fetchFullSchema,
    schema,
    loading,
    error,
  } = useQueryBuilderContext();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedDatabase) {
      fetchFullSchema(selectedDatabase);
      setExpandedSections({});
    }
  }, [selectedDatabase]);

  const toggleSection = (tableName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const SectionHeader: React.FC<{
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
  }> = ({ title, isExpanded, onToggle }) => (
    <div
      className={`flex items-center cursor-pointer p-2 gap-2 hover:bg-blue-50 select-none text-blue-500 border-y border-blue-50 ${
        isExpanded ? "bg-blue-50" : "bg-white"
      }`}
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

  const FieldItem: React.FC<{ field: any }> = ({ field }) => (
    <div className="flex py-1 px-3 justify-between items-center hover:bg-blue-50">
      <span className="text-gray-700 text-sm">{field.Field}</span>
      <span className="text-gray-500 text-xs">{field.Type}</span>
    </div>
  );

  const tables = selectedDatabase
    ? Object.keys(schema?.[selectedDatabase] || {})
    : [];

  return (
    <div className="mt-3">
      <h3 className="input-label">
        {selectedDatabase ? `Tables (${tables.length})` : "Tables"}
      </h3>

      {loading.dbs || !schema?.[selectedDatabase || ""] ? (
        <p className="text-xs text-gray-500 mt-1">Loading schema…</p>
      ) : error ? (
        <p className="text-xs text-red-500 mt-1">Error: {error}</p>
      ) : tables.length === 0 ? (
        <p className="text-xs text-gray-500 mt-1">No tables found.</p>
      ) : (
        <div className="rounded-lg border border-blue-300 overflow-hidden">
          {tables.map((tableName) => (
            <div key={tableName}>
              <SectionHeader
                title={tableName}
                isExpanded={!!expandedSections[tableName]}
                onToggle={() => toggleSection(tableName)}
              />
              {expandedSections[tableName] &&
                schema?.[selectedDatabase!]?.[tableName]?.map((field) => (
                  <FieldItem key={field.Field} field={field} />
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntitySection;
