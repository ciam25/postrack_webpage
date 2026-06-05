const leadForm = document.querySelector("#lead-form");
const platformInput = document.querySelector("#platform");
const platformButtons = document.querySelectorAll("[data-platform-option]");
const downloadButtons = document.querySelectorAll("[data-platform]");
const successCard = document.querySelector("#success-card");
const preregisterSection = document.querySelector("#preregistro");

const contactEmail = "contacto@postrack.local";

function setPlatform(platform) {
  platformInput.value = platform;
  platformButtons.forEach((button) => {
    const isActive = button.dataset.platformOption === platform;
    button.classList.toggle("active", isActive);
  });
}

function focusFirstField() {
  const firstInput = leadForm.querySelector("input[name='name']");
  if (firstInput) {
    window.setTimeout(() => firstInput.focus({ preventScroll: true }), 420);
  }
}

downloadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const platform = button.dataset.platform || "Android";
    setPlatform(platform);
    preregisterSection.scrollIntoView({ behavior: "smooth", block: "start" });
    leadForm.animate(
      [
        { transform: "translateY(14px)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
        { transform: "translateY(0)", boxShadow: "0 30px 80px rgba(0,0,0,0.28)" },
      ],
      { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    focusFirstField();
  });
});

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setPlatform(button.dataset.platformOption || "Android");
  });
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const lead = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    business: String(formData.get("business") || "").trim(),
    platform: String(formData.get("platform") || "Android").trim(),
    createdAt: new Date().toISOString(),
  };

  const storedLeads = JSON.parse(localStorage.getItem("postrack_preleads") || "[]");
  storedLeads.push(lead);
  localStorage.setItem("postrack_preleads", JSON.stringify(storedLeads));

  const subject = encodeURIComponent(`Preregistro Postrack ${lead.platform}`);
  const body = encodeURIComponent(
    [
      "Solicitud de descarga Postrack Local",
      "",
      `Plataforma: ${lead.platform}`,
      `Nombre: ${lead.name}`,
      `Correo: ${lead.email}`,
      `Telefono: ${lead.phone}`,
      `Negocio: ${lead.business || "No indicado"}`,
    ].join("\n")
  );

  successCard.hidden = false;
  successCard.animate(
    [
      { opacity: 0, transform: "translateY(10px) scale(.98)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    { duration: 260, easing: "ease-out" }
  );

  window.setTimeout(() => {
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }, 450);
});
