let previousData = {
    funds: 0,
    pending: 0,
    members: 0,
    total_sales: 0
};

function animateNumber(element, startValue, endValue) {
    gsap.fromTo(
        element,
        { textContent: startValue },
        {
            textContent: endValue,
            duration: 1,
            ease: "linear",
            snap: { textContent: 1 },
            onUpdate: function() {
                element.textContent = parseInt(this.targets()[0].textContent).toLocaleString();
            }
        }
    );
}

function animateProductDetails(productElement, endValues) {
    gsap.fromTo(
        productElement.querySelector('h3'),
        { textContent: 0 },
        {
            textContent: endValues.revenue,
            duration: 1,
            ease: "linear",
            snap: { textContent: 1 },
            onUpdate: function() {
                productElement.querySelector('h3').textContent = parseInt(this.targets()[0].textContent).toLocaleString() + ' Robux';
            }
        }
    );

    gsap.fromTo(
        productElement.querySelector('p:nth-of-type(1)'),
        { textContent: 0 },
        {
            textContent: endValues.salesCount,
            duration: 1,
            ease: "linear",
            snap: { textContent: 1 },
            onUpdate: function() {
                productElement.querySelector('p:nth-of-type(1)').textContent = this.targets()[0].textContent + ' Sales';
            }
        }
    );

    gsap.fromTo(
        productElement.querySelector('p:nth-of-type(2)'),
        { textContent: 0 },
        {
            textContent: endValues.fav,
            duration: 1,
            ease: "linear",
            snap: { textContent: 1 },
            onUpdate: function() {
                productElement.querySelector('p:nth-of-type(2)').textContent = this.targets()[0].textContent + ' Favorites';
            }
        }
    );
}

function initAnimations() {
    const stats = document.querySelectorAll('[id^="funds"], [id^="pending"], [id^="members"], [id^="total_sales"]');
    stats.forEach(stat => {
        const endValue = parseInt(stat.getAttribute('data-end'), 10);
        const currentValue = parseInt(stat.textContent.replace(/,/g, ''), 10) || 0;
        animateNumber(stat, currentValue, endValue);
    });
}

function updateData() {
    fetch('https://mrpoorguy.fun')
        .then(response => response.json())
        .then(data => {
            document.getElementById('funds').setAttribute('data-end', data.funds);
            document.getElementById('pending').setAttribute('data-end', data.pending);
            document.getElementById('members').setAttribute('data-end', data.members);
            document.getElementById('total_sales').setAttribute('data-end', data.total_sales);

            // Update and animate stats
            const stats = document.querySelectorAll('[id^="funds"], [id^="pending"], [id^="members"], [id^="total_sales"]');
            stats.forEach(stat => {
                const endValue = parseInt(stat.getAttribute('data-end'), 10);
                const currentValue = previousData[stat.id] || 0;
                animateNumber(stat, currentValue, endValue);
                previousData[stat.id] = endValue;
            });

            // Update best-selling products
            const bestSellingContainer = document.getElementById('best-selling');
            bestSellingContainer.innerHTML = '';
            data.best_selling.forEach(item => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                productElement.onclick = () => window.location.href = `https://roblox.com/catalog/${item.targetId}`;
                productElement.innerHTML = `
                    <img src="${item.img}" alt="Product photo">
                    <h4>${item.name}</h4>
                    <h3>${item.revenue} Robux</h3>
                    <p>${item.salesCount} Sales</p>
                    <p>${item.fav} Favorites</p>
                `;
                bestSellingContainer.appendChild(productElement);

                // Animate product details
                animateProductDetails(productElement, {
                    revenue: item.revenue,
                    salesCount: item.salesCount,
                    fav: item.fav
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    updateData();
    setInterval(updateData, 30000);
});