/* Small, dependency-free enhancements: site search, form validation, nav state, gentle scroll reveal. */

/* ---------- Search ---------- */
(function () {
    var form = document.getElementById('search-form');
    var input = document.getElementById('q');
    var msg = document.getElementById('search-msg');
    var list = document.getElementById('search-results');

    // Everything on the site that a visitor might look for.
    var INDEX = [
        { title: 'Home', url: 'index.html#home', words: 'welcome hackathon trent university weekend' },
        { title: 'About us', url: 'index.html#about', words: 'about student run mentors workshops food beginners' },
        { title: 'Apply now', url: 'index.html#apply', words: 'apply application sign up register join form team' },
        { title: 'Event schedule', url: 'index.html#schedule', words: 'schedule times timetable saturday sunday breakfast dinner demos awards' },
        { title: 'Contact', url: 'index.html#contact', words: 'contact email organizers sponsorship questions help' },
        { title: 'HackTrent 2025 recap', url: 'recap.html', words: 'recap news 2025 last year photos balloons' },
        { title: 'Accessibility', url: 'accessibility.html', words: 'accessibility keyboard screen reader access problem' },
        { title: 'Privacy policy', url: 'privacy.html', words: 'privacy data information fonts google' },
        { title: 'Terms of use', url: 'terms.html', words: 'terms rules conduct projects' }
    ];

    function find(term) {
        var parts = term.toLowerCase().split(/\s+/).filter(Boolean);
        return INDEX.filter(function (item) {
            var hay = (item.title + ' ' + item.words).toLowerCase();
            return parts.every(function (p) { return hay.indexOf(p) !== -1; });
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        list.textContent = '';
        var term = input.value.trim();

        if (!term) {
            input.setAttribute('aria-invalid', 'true');
            msg.textContent = 'Enter a word to search for.';
            input.focus();
            return;
        }

        input.removeAttribute('aria-invalid');
        var results = find(term);

        if (!results.length) {
            msg.textContent = 'No results for “' + term + '”. Try “schedule” or “apply”.';
            return;
        }

        msg.textContent = results.length + (results.length === 1 ? ' result' : ' results') + ' for “' + term + '”:';
        results.forEach(function (item) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            li.appendChild(a);
            list.appendChild(li);
        });
    });

    input.addEventListener('input', function () {
        if (input.value.trim()) {
            input.removeAttribute('aria-invalid');
        }
    });
})();

/* ---------- Apply form ---------- */
(function () {
    var form = document.getElementById('apply-form');
    if (!form) return; // Only the home page has the apply form.
    var summary = document.getElementById('error-summary');
    var summaryList = summary.querySelector('ul');
    var status = document.getElementById('apply-status');

    // Each rule returns an error message, or '' when the field is fine.
    var rules = {
        name: function () {
            return form.elements.name.value.trim() ? '' : 'Enter your full name.';
        },
        email: function () {
            var v = form.elements.email.value.trim();
            if (!v) return 'Enter your email address.';
            return /^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter an email address in the format name@example.com.';
        },
        year: function () {
            return form.elements.year.value ? '' : 'Choose your year of study.';
        },
        team: function () {
            return form.elements.team.value ? '' : 'Choose a team size.';
        },
        conduct: function () {
            return form.elements.conduct.checked ? '' : 'Agree to the code of conduct to apply.';
        }
    };

    // The element a summary link should focus for each field.
    var focusTarget = {
        name: 'name', email: 'email', year: 'year', team: 'team-1', conduct: 'conduct'
    };

    function showError(key, text) {
        var el = document.getElementById(key + '-error');
        var control = key === 'team' ? null : document.getElementById(key);
        if (text) {
            el.innerHTML = '<span class="visually-hidden">Error: </span>';
            el.appendChild(document.createTextNode(text));
            el.hidden = false;
            if (control) control.setAttribute('aria-invalid', 'true');
        } else {
            el.hidden = true;
            el.textContent = '';
            if (control) control.removeAttribute('aria-invalid');
        }
    }

    function validateAll() {
        var problems = [];
        Object.keys(rules).forEach(function (key) {
            var text = rules[key]();
            showError(key, text);
            if (text) problems.push({ key: key, text: text });
        });
        return problems;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.textContent = '';
        var problems = validateAll();

        if (problems.length) {
            summaryList.innerHTML = '';
            problems.forEach(function (p) {
                var li = document.createElement('li');
                li.setAttribute('data-key', p.key);
                var a = document.createElement('a');
                a.href = '#' + focusTarget[p.key];
                a.textContent = p.text;
                a.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    document.getElementById(focusTarget[p.key]).focus();
                });
                li.appendChild(a);
                summaryList.appendChild(li);
            });
            summary.hidden = false;
            summary.focus();
            return;
        }

        summary.hidden = true;
        var who = form.elements.name.value.trim();
        var where = form.elements.email.value.trim();
        form.reset();
        status.textContent = 'Thanks, ' + who + '. Your application is in. We will email ' + where + ' with next steps.';
    });

    // Clear an error as soon as the person fixes the field, and keep the summary in step.
    form.addEventListener('input', clearFixed);
    form.addEventListener('change', clearFixed);

    function clearFixed(e) {
        var key = e.target.name;
        if (rules[key] && !document.getElementById(key + '-error').hidden && !rules[key]()) {
            showError(key, '');
            var item = summaryList.querySelector('[data-key="' + key + '"]');
            if (item) item.remove();
            if (!summaryList.children.length) summary.hidden = true;
        }
    }
})();

/* ---------- Mark the current section in the nav ---------- */
(function () {
    var links = document.querySelectorAll('.site-nav a[href^="#"]');
    if (!links.length) return; // Other pages link to index.html#..., so nothing to track.

    var sections = Array.prototype.map.call(links, function (a) {
        return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);

    function setCurrent(id) {
        links.forEach(function (a) {
            if (a.getAttribute('href') === '#' + id) {
                a.setAttribute('aria-current', 'location');
            } else {
                a.removeAttribute('aria-current');
            }
        });
    }

    // The current section is the last one whose top has passed 30% of the window.
    // At the very bottom of the page the final (short) section always wins.
    function update() {
        var line = window.innerHeight * 0.3;
        var current = sections[0];
        sections.forEach(function (s) {
            if (s.getBoundingClientRect().top <= line) current = s;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            current = sections[sections.length - 1];
        }
        setCurrent(current.id);
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

/* ---------- Ease sections in as they are scrolled to ---------- */
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sections = document.querySelectorAll('.content section + section');
    if (reduce || !('IntersectionObserver' in window) || !sections.length) return;

    document.documentElement.classList.add('reveal-ready');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
})();
