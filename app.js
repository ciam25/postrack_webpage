const leadForm = document.querySelector("#lead-form");
const platformInput = document.querySelector("#platform");
const platformButtons = document.querySelectorAll("[data-platform-option]");
const downloadButtons = document.querySelectorAll("[data-platform]");
const successCard = document.querySelector("#success-card");
const preregisterSection = document.querySelector("#preregistro");
const submitButton = leadForm.querySelector(".submit-button");

const contactEmail = "contacto@postrack.local";
const leadEndpoint = window.POSTRACK_LEAD_ENDPOINT || "";
const downloadBaseUrl =
  window.POSTRACK_DOWNLOAD_BASE_URL || "https://ciam25.github.io/postrack_webpage/descarga";

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
    leadForm.animate(
      [
        { transform: "translateY(0)", boxShadow: "0 30px 80px rgba(0,0,0,0.28)" },
        { transform: "translateY(-4px)", boxShadow: "0 34px 88px rgba(72,9,105,0.34)" },
        { transform: "translateY(0)", boxShadow: "0 30px 80px rgba(0,0,0,0.28)" },
      ],
      { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });
});

function createDownloadToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createDownloadLink(platform, token) {
  const url = new URL(downloadBaseUrl);
  url.searchParams.set("platform", platform.toLowerCase());
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendLead(lead) {
  if (!leadEndpoint) return { mode: "fallback" };

  const response = await fetch(leadEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(`Lead endpoint failed with ${response.status}`);
  }

  return { mode: "endpoint" };
}

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const downloadToken = createDownloadToken();
  const selectedPlatform = String(formData.get("platform") || "Android").trim();
  const lead = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    business: String(formData.get("business") || "").trim(),
    platform: selectedPlatform,
    downloadToken,
    downloadLink: createDownloadLink(selectedPlatform, downloadToken),
    createdAt: new Date().toISOString(),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Generando enlace...";

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
      `Enlace unico: ${lead.downloadLink}`,
      `Token: ${lead.downloadToken}`,
    ].join("\n")
  );

  try {
    const result = await sendLead(lead);
    successCard.hidden = false;
    successCard.querySelector("strong").textContent = "Enlace generado.";
    successCard.querySelector("span").textContent =
      result.mode === "endpoint"
        ? `Enviamos el enlace unico a ${lead.email}.`
        : `Generamos tu enlace unico. Revisa el correo para continuar la descarga.`;
    successCard.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 260, easing: "ease-out" }
    );

    if (result.mode === "fallback") {
      window.setTimeout(() => {
        window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      }, 450);
    }
  } catch (error) {
    console.error(error);
    successCard.hidden = false;
    successCard.querySelector("strong").textContent = "No pudimos enviar el enlace.";
    successCard.querySelector("span").textContent =
      "Tus datos quedaron preparados. Intenta de nuevo o contactanos por WhatsApp.";
    successCard.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 260, easing: "ease-out" }
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enviarme enlace unico";
  }
});
