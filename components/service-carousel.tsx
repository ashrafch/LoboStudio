"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ServicePhoto } from "./service-photo";
import {
  services,
  servicePhoto,
  type ServicePhotoOverrides,
} from "@/content/services";

export function ServiceCarousel({
  photos,
}: {
  photos?: ServicePhotoOverrides;
}) {
  const [active, setActive] = useState(0);
  const { title, description } = services[active];
  const photo = servicePhoto(services[active], photos);
  return (
    <section
      id="attivita"
      className="section"
      aria-labelledby="service-heading"
    >
      <div className="section-heading">
        <h2 id="service-heading">Attività dello studio</h2>
        <Link className="underlined" href="/servizi">
          Tutte le {services.length} attività
        </Link>
      </div>
      <div className="service-selector">
        <ul>
          {services.map(({ title: name }, index) => (
            <li key={name}>
              <button
                type="button"
                aria-pressed={index === active}
                aria-controls="service-summary"
                onClick={() => setActive(index)}
              >
                {name}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <div
          className="service-summary"
          id="service-summary"
          aria-live="polite"
        >
          {photo && <ServicePhoto photo={photo} />}
          <div className="service-copy" key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
