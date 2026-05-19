const updatePostFrom = document.querySelector("#update");

updatePostFrom.addEventListener("submit", (event) => {
	event.preventDefault();

	const formData = new FormData(updatePostFrom);
	const data = Object.fromEntries(formData.entries());

	fetch("/posts", {
		method: "put",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})
		.then((res) => {
			if (res.ok) return res.json();
		})
		.then((response) => {
			console.log(response);
			window.location.reload(true);
		});
});

const deletePostForm = document.querySelector("#delete");

deletePostForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const formData = new FormData(deletePostForm);
	const data = Object.fromEntries(formData.entries());

	fetch("/posts", {
		method: "delete",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})
		.then((res) => {
			if (res.ok) return res.json();
		})
		.then((response) => {
			console.log(response);
			window.location.reload(true);
		});
});
