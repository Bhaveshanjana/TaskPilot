import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects, onDelete, onEdit }) {
  if (!projects.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No projects found.
      </p>
    );
  }

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
