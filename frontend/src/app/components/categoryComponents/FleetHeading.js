// FleetHeading.jsx  (SERVER component)
export default function FleetHeading({ categoryFullName }) {
  return (
    <h3 id="fleet-heading" className="roh_section_title_h3 text-center mt-0">
      <span>Explore our perfect and</span>
      <br />
      <span>extensive fleet of {categoryFullName}</span>
    </h3>
  );
}