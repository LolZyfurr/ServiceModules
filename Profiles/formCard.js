export default function newFormCard({
    id = "commissionForm",
    submitText = "Review Order & TOS",
    onSubmit = null,
    fields = [
        {
            id: "clientName",
            name: "clientName",
            label: "Client Name / Handle",
            type: "text",
            required: true,
            placeholder: "e.g. @username"
        },
        {
            id: "commissionType",
            name: "commissionType",
            label: "Commission Type",
            type: "select",
            required: true,
            options: [
                { label: "Select a type...", value: "", disabled: true, selected: true },
                { label: "Headshot / Icon ($35)", value: "Headshot / Icon" },
                { label: "Half Body ($65)", value: "Half Body" },
                { label: "Full Body Illustration ($100)", value: "Full Body Illustration" }
            ]
        },
        {
            id: "characterRef",
            name: "characterRef",
            label: "Character Reference / Description",
            type: "textarea",
            required: true,
            rows: 4,
            placeholder: "Describe your character, pose ideas, or link reference images..."
        },
        {
            id: "commercialUse",
            name: "commercialUse",
            label: "Commercial Usage Rights",
            type: "radio",
            required: false,
            options: [
                { label: "Personal Use Only (Standard)", value: "personal", checked: true },
                { label: "Commercial License (+50% fee)", value: "commercial" }
            ]
        },
        {
            id: "addons",
            name: "addons",
            label: "Add-ons & Extras",
            type: "checkbox",
            required: false,
            options: [
                { label: "Detailed Background", value: "background" },
                { label: "Additional Character (+75%)", value: "extra_character" },
                { label: "Alternative Outfit / Version", value: "nsfw" },
                { label: "Layered PSD / Source File", value: "source_file" }
            ]
        },
        {
            id: "artStyle",
            name: "artStyle",
            label: "Preferred Art Style / Finish",
            type: "select",
            required: false,
            options: [
                { label: "Select a style preference...", value: "", selected: true },
                { label: "Cel Shaded / Flat Colors", value: "cel_shaded" },
                { label: "Soft Rendered / Painted", value: "soft_render" },
                { label: "Rough Sketch / Lineart", value: "sketch" }
            ]
        },
        {
            id: "referenceFiles",
            name: "referenceFiles",
            label: "Upload Reference Files / Images",
            type: "file",
            required: false,
            multiple: true,
            accept: "image/*,audio/*"
        },
        {
            id: "targetDate",
            name: "targetDate",
            label: "Preferred Deadline / Target Date",
            type: "date",
            required: false
        },
        {
            id: "contact",
            name: "contact",
            label: "Social Media Contact / Discord Tag",
            type: "text",
            required: false,
            placeholder: "e.g. username#0000 or @handle"
        },
        {
            id: "notes",
            name: "notes",
            label: "Additional Notes / Specific Requests",
            type: "textarea",
            required: false,
            rows: 3,
            placeholder: "Any additional details, moodboards, color palettes, or instructions..."
        }
    ]
} = {}) {
    const form = document.createElement("form");
    form.id = id;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit(e, getData());
        } else if (typeof window.openTosModal === "function") {
            window.openTosModal();
        }
    });

    fields.forEach((field) => {
        const formGroup = document.createElement("div");
        formGroup.className = "form-group";

        const label = document.createElement("label");
        label.textContent = field.label + " ";

        if (field.required) {
            const req = document.createElement("span");
            req.style.color = "#ff5555";
            req.textContent = "*";
            label.appendChild(req);
        } else {
            const opt = document.createElement("span");
            opt.style.color = "#888";
            opt.style.fontWeight = "normal";
            opt.textContent = "(Optional)";
            label.appendChild(opt);
        }

        formGroup.appendChild(label);

        const fieldName = field.name || field.id;

        switch (field.type) {
            case "select": {
                const select = document.createElement("select");
                select.name = fieldName;
                if (field.id) select.id = field.id;
                if (field.required) select.required = true;

                (field.options || []).forEach((opt) => {
                    const option = document.createElement("option");
                    option.value = opt.value;
                    option.textContent = opt.label;
                    if (opt.disabled) option.disabled = true;
                    if (opt.selected) option.selected = true;
                    select.appendChild(option);
                });

                formGroup.appendChild(select);
                break;
            }

            case "textarea": {
                const textarea = document.createElement("textarea");
                textarea.name = fieldName;
                if (field.id) textarea.id = field.id;
                if (field.required) textarea.required = true;
                if (field.rows) textarea.rows = field.rows;
                if (field.placeholder) textarea.placeholder = field.placeholder;

                formGroup.appendChild(textarea);
                break;
            }

            case "radio":
            case "checkbox": {
                const container = document.createElement("div");
                container.style.display = "flex";
                container.style.flexDirection = "column";
                container.style.gap = "6px";
                container.style.marginTop = "4px";

                (field.options || []).forEach((opt) => {
                    const optLabel = document.createElement("label");
                    optLabel.style.fontWeight = "normal";
                    optLabel.style.cursor = "pointer";

                    const input = document.createElement("input");
                    input.type = field.type;
                    input.name = fieldName;
                    input.value = opt.value;
                    if (opt.checked) input.checked = true;

                    optLabel.appendChild(input);
                    optLabel.appendChild(document.createTextNode(" " + opt.label));
                    container.appendChild(optLabel);
                });

                formGroup.appendChild(container);
                break;
            }

            case "file": {
                const input = document.createElement("input");
                input.type = "file";
                input.name = fieldName;
                if (field.id) input.id = field.id;
                if (field.multiple) input.multiple = true;
                if (field.accept) input.accept = field.accept;
                if (field.required) input.required = true;

                formGroup.appendChild(input);
                break;
            }

            default: {
                const input = document.createElement("input");
                input.type = field.type || "text";
                input.name = fieldName;
                if (field.id) input.id = field.id;
                if (field.required) input.required = true;
                if (field.placeholder) input.placeholder = field.placeholder;

                formGroup.appendChild(input);
                break;
            }
        }

        form.appendChild(formGroup);
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "submit-btn";
    submitBtn.textContent = submitText;
    form.appendChild(submitBtn);

    function getData() {
        const formData = new FormData(form);
        const result = {};

        fields.forEach((field) => {
            const key = field.name || field.id;
            if (field.type === "checkbox") {
                result[key] = formData.getAll(key);
            } else if (field.type === "file") {
                const fileInput = form.querySelector(`input[name="${key}"]`);
                result[key] = fileInput ? Array.from(fileInput.files) : [];
            } else {
                result[key] = formData.get(key) || "";
            }
        });

        return result;
    }

    function parent(target) {
        const parentElem = typeof target === "string" ? document.querySelector(target) : target;
        if (parentElem) {
            parentElem.appendChild(form);
        }
    }

    function destroy() {
        if (form.parentNode) {
            form.parentNode.removeChild(form);
        }
    }

    function replace(newElement) {
        if (form.parentNode) {
            const target = typeof newElement === "string" ? document.querySelector(newElement) : newElement;
            form.parentNode.replaceChild(target, form);
        }
    }

    function setDisplayOrder(order) {
        form.style.order = order;
    }

    return {
        element: form,
        data: getData,
        parent,
        destroy,
        replace,
        setDisplayOrder
    };
}
