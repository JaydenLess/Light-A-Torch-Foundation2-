document.addEventListener('DOMContentLoaded', function () {
    // ========= 1. MOBILE NAV TOGGLE =========
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('header nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.getAttribute('data-open') === 'true';
            nav.setAttribute('data-open', String(!isOpen));
            nav.style.display = isOpen ? 'none' : 'block';
        });

        // Make sure nav is visible again on resize for desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                nav.style.display = 'flex';
                nav.setAttribute('data-open', 'false');
            } else if (nav.getAttribute('data-open') !== 'true') {
                nav.style.display = 'none';
            }
        });
    }

    // ========= 2. SMOOTH SCROLL FOR INTERNAL LINKS =========
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });

                // Close mobile nav after click
                if (window.innerWidth <= 768 && nav) {
                    nav.style.display = 'none';
                    nav.setAttribute('data-open', 'false');
                }
            }
        });
    });

    // ========= 3. DONATION PANEL LOGIC =========
    const donationPanel = document.querySelector('.donation-panel');
    if (donationPanel) {
        const amountOptions = donationPanel.querySelectorAll('.amount-option');
        const customAmountInput = donationPanel.querySelector('.custom-input input');
        const donateBtn = donationPanel.querySelector('.donate-btn');
        const toggle = donationPanel.querySelector('.toggle');
        const toggleKnob = donationPanel.querySelector('.toggle-knob');

        let selectedAmount = null;
        let isMonthly = false; // false = one-time, true = monthly

        // Helper: "JMD 3,500" -> 3500
        function parseAmount(text) {
            if (!text) return null;
            return Number(text.replace(/[^0-9]/g, '')) || null;
        }

        // Handle preset amount click
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                amountOptions.forEach(o => o.classList.remove('highlight'));
                option.classList.add('highlight');

                const label = option.textContent.trim().toLowerCase();
                if (label.includes('custom')) {
                    if (customAmountInput) {
                        customAmountInput.focus();
                        selectedAmount = parseFloat(customAmountInput.value) || null;
                    }
                } else {
                    const amt = parseAmount(option.textContent);
                    selectedAmount = amt;
                    if (customAmountInput) {
                        customAmountInput.value = amt || '';
                    }
                }
            });
        });

        // Handle typing custom amount
        if (customAmountInput) {
            customAmountInput.addEventListener('input', () => {
                const customOption = Array.from(amountOptions).find(opt =>
                    opt.textContent.toLowerCase().includes('custom')
                );
                if (customOption) {
                    amountOptions.forEach(o => o.classList.remove('highlight'));
                    customOption.classList.add('highlight');
                }
                selectedAmount = parseFloat(customAmountInput.value) || null;
            });
        }

        // One-time / monthly toggle
        if (toggle && toggleKnob) {
            toggle.addEventListener('click', () => {
                isMonthly = !isMonthly;
                toggle.dataset.mode = isMonthly ? 'monthly' : 'once';
                toggle.style.justifyContent = isMonthly ? 'flex-end' : 'flex-start';
                toggleKnob.title = isMonthly ? 'Monthly donation selected' : 'One-time donation selected';
            });

            // Initial state
            toggle.style.justifyContent = 'flex-start';
        }

        // Donate button click
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                // Use custom input if nothing selected
                if (!selectedAmount && customAmountInput) {
                    selectedAmount = parseFloat(customAmountInput.value) || null;
                }

                if (!selectedAmount || selectedAmount < 500) {
                    alert('Please enter a valid amount (minimum JMD 500) before continuing.');
                    return;
                }

                const modeText = isMonthly ? 'monthly' : 'one-time';

                // 🔒 This is where REAL payment integration would go.
                // For now, we just show a confirmation message.
                alert(
                    `Thank you for your generosity!\n\n` +
                    `You selected a ${modeText} donation of JMD ${selectedAmount.toLocaleString()}.\n\n` +
                    `In a live site, this button would now send you to PayPal / Donorbox / bank details.`
                );
            });
        }
    }

    // ========= 4. VOLUNTEER FORM =========
    const volunteerCard = document.querySelector('#volunteer .two-col .card:nth-child(1)');
    if (volunteerCard) {
        const [nameInput, emailInput] = volunteerCard.querySelectorAll('input');
        const interestSelect = volunteerCard.querySelector('select');
        const submitBtn = volunteerCard.querySelector('button');
        const msg = document.createElement('div');

        msg.style.marginTop = '0.7rem';
        msg.style.fontSize = '0.8rem';
        volunteerCard.appendChild(msg);

        function showVolunteerMessage(text, isError = false) {
            msg.textContent = text;
            msg.style.color = isError ? '#ffb3b3' : '#b6ffc7';
        }

        if (submitBtn && nameInput && emailInput && interestSelect) {
            submitBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const interest = interestSelect.value;

                if (!name || !email || interest === 'Area of interest') {
                    showVolunteerMessage('Please fill in all fields before submitting.', true);
                    return;
                }

                if (!email.includes('@') || !email.includes('.')) {
                    showVolunteerMessage('Please enter a valid email address.', true);
                    return;
                }

                showVolunteerMessage(
                    'Thank you! We\'ve received your interest and will be in touch via email.',
                    false
                );

                // Clear fields
                nameInput.value = '';
                emailInput.value = '';
                interestSelect.value = 'Area of interest';
            });
        }
    }

    // ========= 5. NEWSLETTER FORM =========
    const newsletterCard = document.querySelector('#volunteer .two-col .card:nth-child(2)');
    if (newsletterCard) {
        const emailInput = newsletterCard.querySelector('.newsletter-input input');
        const joinBtn = newsletterCard.querySelector('.newsletter-input button');
        const msg = document.createElement('div');

        msg.style.marginTop = '0.7rem';
        msg.style.fontSize = '0.8rem';
        newsletterCard.appendChild(msg);

        function showNewsletterMessage(text, isError = false) {
            msg.textContent = text;
            msg.style.color = isError ? '#ffb3b3' : '#b6ffc7';
        }

        if (emailInput && joinBtn) {
            joinBtn.addEventListener('click', () => {
                const email = emailInput.value.trim();

                if (!email) {
                    showNewsletterMessage('Please enter your email address to join.', true);
                    return;
                }

                if (!email.includes('@') || !email.includes('.')) {
                    showNewsletterMessage('Please enter a valid email address.', true);
                    return;
                }

                showNewsletterMessage('You’re in! Thanks for joining our update list.', false);
                emailInput.value = '';
            });
        }
    }
});
